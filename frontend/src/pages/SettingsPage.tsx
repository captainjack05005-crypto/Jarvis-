import React from 'react';
import { useSettingsStore } from '@/store/settings';
import { HUDPanel } from '@/components/HUD';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Moon, Volume2, Bell, Save, Type } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const {
    theme,
    voiceEnabled,
    notificationsEnabled,
    autoSave,
    fontSize,
    setTheme,
    setVoiceEnabled,
    setNotificationsEnabled,
    setAutoSave,
    setFontSize,
  } = useSettingsStore();

  const settings = [
    {
      title: 'Appearance',
      icon: Moon,
      items: [
        {
          label: 'Theme',
          description: 'Choose between light and dark theme',
          type: 'toggle' as const,
          value: theme === 'dark',
          onChange: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
        },
        {
          label: 'Font Size',
          description: 'Adjust text size for better readability',
          type: 'select' as const,
          value: fontSize,
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
          onChange: (value: string) =>
            setFontSize(value as 'small' | 'medium' | 'large'),
        },
      ],
    },
    {
      title: 'Voice',
      icon: Volume2,
      items: [
        {
          label: 'Voice Input',
          description: 'Enable voice commands and input',
          type: 'toggle' as const,
          value: voiceEnabled,
          onChange: () => setVoiceEnabled(!voiceEnabled),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Desktop Notifications',
          description: 'Receive notifications for messages',
          type: 'toggle' as const,
          value: notificationsEnabled,
          onChange: () => setNotificationsEnabled(!notificationsEnabled),
        },
      ],
    },
    {
      title: 'General',
      icon: Save,
      items: [
        {
          label: 'Auto-Save',
          description: 'Automatically save conversations',
          type: 'toggle' as const,
          value: autoSave,
          onChange: () => setAutoSave(!autoSave),
        },
      ],
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <div className="flex-1 overflow-y-auto mt-16 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold gradient-text glow-text mb-2">
              Settings
            </h1>
            <p className="text-gray-400">Customize your JARVIS experience</p>
          </motion.div>

          {/* Settings Grid */}
          <div className="grid gap-6">
            {settings.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HUDPanel>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <IconComponent
                          size={24}
                          className="text-cyan-400"
                        />
                        <h2 className="text-2xl font-bold text-gray-100">
                          {section.title}
                        </h2>
                      </div>

                      <div className="space-y-4">
                        {section.items.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium text-gray-200">
                                {item.label}
                              </p>
                              <p className="text-sm text-gray-400">
                                {item.description}
                              </p>
                            </div>

                            {item.type === 'toggle' && (
                              <button
                                onClick={item.onChange}
                                className={`relative w-12 h-6 rounded-full transition-colors ${
                                  item.value
                                    ? 'bg-cyan-500'
                                    : 'bg-slate-700'
                                }`}
                              >
                                <div
                                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                    item.value ? 'translate-x-6' : ''
                                  }`}
                                />
                              </button>
                            )}

                            {item.type === 'select' && (
                              <select
                                value={item.value}
                                onChange={(e) => item.onChange(e.target.value)}
                                className="px-3 py-2 bg-slate-700 border border-cyan-500/30 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-400"
                              >
                                {item.options?.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </HUDPanel>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
