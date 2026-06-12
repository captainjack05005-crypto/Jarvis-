"""Chat and conversation endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import logging
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.conversation import (
    ChatRequest,
    ChatResponse,
    ConversationResponse,
    ConversationCreate,
    ConversationUpdate,
    MessageResponse,
)
from app.services.conversation_service import ConversationService
from app.services.openai_service import OpenAIService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])
openai_service = OpenAIService()


@router.post("/message", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ChatResponse:
    """Send a message and get AI response."""
    try:
        user_id = current_user["user_id"]

        # Create or get conversation
        if chat_request.conversation_id:
            conversation = await ConversationService.get_conversation(
                db, chat_request.conversation_id, user_id
            )
        else:
            conversation = await ConversationService.create_conversation(
                db,
                user_id,
                ConversationCreate(),
            )

        # Add user message
        user_message = await ConversationService.add_message(
            db,
            conversation.id,
            "user",
            chat_request.message,
        )

        # Get conversation history
        history = await ConversationService.get_conversation_history(
            db, conversation.id, user_id
        )

        # Build messages for OpenAI
        messages = [openai_service.build_system_message()]
        for msg in history:
            messages.append({"role": msg.role, "content": msg.content})

        # Get AI response
        ai_response, tokens_used, processing_time = (
            await openai_service.create_chat_completion(messages)
        )

        # Add assistant message
        assistant_message = await ConversationService.add_message(
            db,
            conversation.id,
            "assistant",
            ai_response,
            tokens_used,
            processing_time,
        )

        # Update conversation title if needed
        if not conversation.title:
            title = await openai_service.generate_conversation_title(
                chat_request.message
            )
            await ConversationService.update_conversation(
                db,
                conversation.id,
                user_id,
                ConversationUpdate(title=title),
            )

        # Refresh conversation
        conversation = await ConversationService.get_conversation(
            db, conversation.id, user_id
        )

        logger.info(
            f"Message processed for user {user_id} "
            f"in conversation {conversation.id}"
        )

        return ChatResponse(
            conversation_id=conversation.id,
            user_message=MessageResponse.from_orm(user_message),
            assistant_message=MessageResponse.from_orm(assistant_message),
            conversation=ConversationResponse.from_orm(conversation),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process message",
        )


@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    skip: int = 0,
    limit: int = 20,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[ConversationResponse]:
    """List all conversations for the current user."""
    try:
        conversations = await ConversationService.get_user_conversations(
            db, current_user["user_id"], skip, limit
        )
        return [ConversationResponse.from_orm(c) for c in conversations]
    except Exception as e:
        logger.error(f"Error listing conversations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list conversations",
        )


@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ConversationResponse:
    """Get a specific conversation with all messages."""
    try:
        conversation = await ConversationService.get_conversation(
            db, conversation_id, current_user["user_id"]
        )
        return ConversationResponse.from_orm(conversation)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching conversation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch conversation",
        )


@router.put("/conversations/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(
    conversation_id: str,
    update_data: ConversationUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ConversationResponse:
    """Update a conversation."""
    try:
        conversation = await ConversationService.update_conversation(
            db, conversation_id, current_user["user_id"], update_data
        )
        return ConversationResponse.from_orm(conversation)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating conversation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update conversation",
        )


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a conversation."""
    try:
        await ConversationService.delete_conversation(
            db, conversation_id, current_user["user_id"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting conversation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete conversation",
        )
