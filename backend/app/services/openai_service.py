"""OpenAI service for AI interactions."""

import logging
from typing import List, Dict
import time
from openai import AsyncOpenAI, APIError, RateLimitError

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class OpenAIService:
    """Service for OpenAI API interactions."""

    def __init__(self):
        """Initialize OpenAI client."""
        settings = get_settings()
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
        self.temperature = settings.openai_temperature
        self.max_tokens = settings.openai_max_tokens

    async def create_chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = None,
        max_tokens: int = None,
    ) -> tuple[str, int, float]:
        """Create a chat completion using OpenAI API.

        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Override default temperature
            max_tokens: Override default max tokens

        Returns:
            Tuple of (response_text, tokens_used, processing_time)
        """
        settings = get_settings()
        temp = temperature or self.temperature
        tokens = max_tokens or self.max_tokens

        start_time = time.time()

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temp,
                max_tokens=tokens,
            )

            processing_time = time.time() - start_time
            tokens_used = response.usage.completion_tokens
            content = response.choices[0].message.content

            logger.info(
                f"OpenAI API call successful - "
                f"Tokens: {tokens_used}, Time: {processing_time:.2f}s"
            )

            return content, tokens_used, processing_time

        except RateLimitError as e:
            logger.error(f"OpenAI rate limit exceeded: {str(e)}")
            raise Exception("API rate limit exceeded. Please try again later.")
        except APIError as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise Exception(f"OpenAI API error: {str(e)}")

    async def generate_conversation_title(
        self,
        first_message: str,
    ) -> str:
        """Generate a title for a conversation based on the first message."""
        messages = [
            {
                "role": "user",
                "content": f"Generate a brief title (max 5 words) for a conversation starting with: '{first_message}'"
            }
        ]

        try:
            title, _, _ = await self.create_chat_completion(
                messages=messages,
                max_tokens=20,
            )
            return title.strip()
        except Exception as e:
            logger.error(f"Error generating title: {str(e)}")
            return "New Conversation"

    def build_system_message(self) -> Dict[str, str]:
        """Build the system message for the AI assistant."""
        settings = get_settings()
        return {
            "role": "system",
            "content": settings.system_prompt
        }
