import { useState } from 'react';

const EMOJI_CATEGORIES = {
  'Food & Drink': ['🍔', '🍕', '🍜', '🍱', '🍰', '☕', '🥤', '🍺', '🍷', '🥗', '🌮', '🍝', '🍞', '🥐', '🧀', '🍳'],
  'Transportation': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '✈️', '🚁', '🚢'],
  'Shopping': ['🛍️', '🛒', '💳', '👕', '👗', '👠', '👜', '💄', '💍', '⌚', '📱', '💻', '🖥️'],
  'Bills & Utilities': ['💡', '🔌', '💧', '🔥', '📺', '📻', '📞', '🌐', '🏠', '🏢', '🏭'],
  'Entertainment': ['🎬', '🎮', '🎯', '🎲', '🎪', '🎭', '🎨', '🎤', '🎧', '🎸', '🎹', '🎺', '🎻'],
  'Health & Fitness': ['💊', '🏥', '⚕️', '🏋️', '🤸', '🧘', '🏃', '🚴', '🏊', '⛹️', '🤾', '🧗', '🏌️'],
  'Education': ['📚', '📖', '📝', '✏️', '✒️', '🖊️', '🖋️', '📏', '📐', '🧮', '🔬', '🔭', '📊', '📈', '📉'],
  'Income': ['💰', '💵', '💴', '💶', '💷', '💸', '💳', '💼', '📈', '💎', '🏆', '🎁', '🎉'],
  'Other': ['📝', '📌', '📍', '🔖', '🏷️', '💡', '🔔', '📢', '📣', '📯', '🎊', '🎈', '🎀', '🎁', '🎂', '🎄', '🎆', '🎇', '✨', '🌟', '⭐', '💫', '💥', '💢', '💤', '💨', '👋', '🤝', '👍', '👎', '👏', '🙌', '👐', '🤲', '🙏', '✍️', '💪', '🦵', '🦶', '👂', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄'],
};

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Food & Drink');

  const handleEmojiSelect = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-10 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 flex items-center justify-center text-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {value || '📝'}
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or type emoji"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          maxLength={2}
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
              {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
                <button
                  key={`${selectedCategory}-${emoji}-${index}`}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  className={`w-10 h-10 flex items-center justify-center text-2xl rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    value === emoji ? 'bg-indigo-100 dark:bg-indigo-900' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

