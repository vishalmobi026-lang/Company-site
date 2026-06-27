import os

base_dir = 'c:/G-Tec-Azhagiyamandapam/Company-site/react/src/game'
gameplay_path = os.path.join(base_dir, 'Gameplay.jsx')

with open(gameplay_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Extract blocks (0-indexed)
intro_lines = lines[408:578] # 409 to 578
form_lines = lines[579:800] # 580 to 800
playing_lines = lines[801:1181] # 802 to 1181
result_lines = lines[1182:1469] # 1183 to 1469
style_lines = lines[1472:1571] # 1473 to 1571

destructure_str = "const { gameState, score, playerLane, entities, currentQuestion, floatingTexts, lives, combo, shake, couponCode, copied, correctCount, discount, countries, categories, formData, formError, isFetchingQs, setGameState, setScore, setPlayerLane, setEntities, setCurrentQuestion, setFloatingTexts, setLives, setCombo, setShake, setCouponCode, setCopied, setCorrectCount, setDiscount, setCountries, setCategories, setFormData, setFormError, setIsFetchingQs, triggerShake, addFloatingText, copyToClipboard, handlePhoneChange, submitForm, handleKeyDown, movePlayer, startGame, gameTick, endGame, handleExit, decodeHTML } = ctx;"

import_str = 'import React from "react";\nimport { CheckCircle2, ChevronRight, Gamepad2, GraduationCap, XCircle, ArrowRight, ShieldCheck, Zap, Copy } from "lucide-react";\n\n'

components_dir = os.path.join(base_dir, 'components')
os.makedirs(components_dir, exist_ok=True)

# 1. IntroScreen
with open(os.path.join(components_dir, 'IntroScreen.jsx'), 'w', encoding='utf-8') as f:
    f.write(import_str)
    f.write("export default function IntroScreen({ ctx }) {\n  ")
    f.write(destructure_str + "\n  return (\n    <>\n")
    f.writelines(intro_lines)
    f.write("    </>\n  );\n}\n")

# 2. FormScreen
with open(os.path.join(components_dir, 'FormScreen.jsx'), 'w', encoding='utf-8') as f:
    f.write(import_str)
    f.write("export default function FormScreen({ ctx }) {\n  ")
    f.write(destructure_str + "\n  return (\n    <>\n")
    f.writelines(form_lines)
    f.write("    </>\n  );\n}\n")

# 3. PlayingScreen
with open(os.path.join(components_dir, 'PlayingScreen.jsx'), 'w', encoding='utf-8') as f:
    f.write(import_str)
    f.write("export default function PlayingScreen({ ctx }) {\n  ")
    f.write(destructure_str + "\n  return (\n    <>\n")
    f.writelines(playing_lines)
    f.write("    </>\n  );\n}\n")

# 4. ResultScreen
with open(os.path.join(components_dir, 'ResultScreen.jsx'), 'w', encoding='utf-8') as f:
    f.write(import_str)
    f.write("export default function ResultScreen({ ctx }) {\n  ")
    f.write(destructure_str + "\n  return (\n    <>\n")
    f.writelines(result_lines)
    f.write("    </>\n  );\n}\n")

# 5. GameStyles
with open(os.path.join(components_dir, 'GameStyles.jsx'), 'w', encoding='utf-8') as f:
    f.write('import React from "react";\n\n')
    f.write("export default function GameStyles() {\n  return (\n")
    f.writelines(style_lines)
    f.write("  );\n}\n")

# Now rewrite Gameplay.jsx return block
new_return_block = """  const ctx = { gameState, score, playerLane, entities, currentQuestion, floatingTexts, lives, combo, shake, couponCode, copied, correctCount, discount, countries, categories, formData, formError, isFetchingQs, setGameState, setScore, setPlayerLane, setEntities, setCurrentQuestion, setFloatingTexts, setLives, setCombo, setShake, setCouponCode, setCopied, setCorrectCount, setDiscount, setCountries, setCategories, setFormData, setFormError, setIsFetchingQs, triggerShake, addFloatingText, copyToClipboard, handlePhoneChange, submitForm, handleKeyDown, movePlayer, startGame, gameTick, endGame, handleExit, decodeHTML };

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex items-center justify-center font-sans select-none w-full h-full transition-colors duration-500 ${gameState === "playing" 
        ? "bg-slate-900 overflow-hidden" 
        : "bg-slate-900/80 backdrop-blur-sm"
      }`}
    >
      <IntroScreen ctx={ctx} />
      <FormScreen ctx={ctx} />
      <PlayingScreen ctx={ctx} />
      <ResultScreen ctx={ctx} />
      <GameStyles />
    </div>
  );
}
"""

new_lines = lines[:375]
# add imports at the top
new_lines.insert(2, 'import IntroScreen from "./components/IntroScreen";\n')
new_lines.insert(3, 'import FormScreen from "./components/FormScreen";\n')
new_lines.insert(4, 'import PlayingScreen from "./components/PlayingScreen";\n')
new_lines.insert(5, 'import ResultScreen from "./components/ResultScreen";\n')
new_lines.insert(6, 'import GameStyles from "./components/GameStyles";\n')

with open(gameplay_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
    f.write(new_return_block)

print('Successfully refactored Gameplay.jsx!')
