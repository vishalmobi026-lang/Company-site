import os, glob

components = glob.glob('c:/G-Tec-Azhagiyamandapam/Company-site/react/src/game/components/*Screen.jsx')
for comp in components:
    with open(comp, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'framer-motion' not in content:
        content = content.replace('import React from "react";', 'import React from "react";\nimport { motion, AnimatePresence } from "framer-motion";')
        with open(comp, 'w', encoding='utf-8') as f:
            f.write(content)
print("Done!")
