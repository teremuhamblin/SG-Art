<a id="top"></a>
# 🗂️ SG@Art
- Architecture & Structure du Dépôt

### v10.0.0 • *Neural Macramé Quantum‑Era*

Ce document détaille l'organisation complète du dépôt **SG@Art**, le rôle de chaque module applicatif **(`index.html`, `style.css`, `script.js`)** ainsi que l'architecture de gouvernance et d'automatisation CI/CD du dossier `.github/`.

---

### 🏗️ Arborescence Générale du Dépôt
```text
SG-Art/
├── index.html      🌐 — Interface sémantique ARIA, CSP stricte & Atelier Neural
├── style.css       🎨 — Design System Quantum Obsidian & BlueViolet (@layer, WCAG 2.2)
├── script.js       ⚙️ — Neural Engine v10, Quantum‑Mesh WebGPU (+ repli), WebXR & Exports
├── images/         🖼️ — Logos, badges v10.0.0, textures fibres naturelles/holo & SVG animés
├── docs/           📚 — Documentation technique et structure du projet (structure.md)
├── .github/        🔧 — Gouvernance, modèles Issues/PR/Discussions, Dependabot & CI/CD
├── LICENSE         📜 — Licence personnalisée SG-Art v14.04 (Copyright 2026 Teremu)
└── README.md       📖 — Présentation principale, architecture Mermaid & matrice v10.0.0

.github/
├── CODEOWNERS                          # Responsables de revue et validation du code
├── CODE_OF_CONDUCT.md                  # Règles de conduite de la communauté SG@Art
├── CONTRIBUTING.md                     # Procédure de contribution, conventions & tests locaux
├── SECURITY.md                         # Politique de sécurité, versions supportées (v10.0.x) & signalement
├── SUPPORT.md                          # Canaux d'aide (Issues, Discussions) & bonnes pratiques
├── PULL_REQUEST_TEMPLATE.md            # Modèle PR avec checklist qualité, CSP, WebGPU & A11y
├── dependabot.yml                      # Surveillance hebdomadaire des GitHub Actions (et npm si présent)
├── DISCUSSION_TEMPLATE/
│   └── general.yml                     # Formulaire structuré pour les discussions générales
├── ISSUE_TEMPLATE/
│   ├── config.yml                      # Redirection vers Sécurité & Discussions
│   └── sg-art-issue.yml                # Formulaire unifié (Bug, Feature Request, Amélioration, Question)
└── workflows/
    ├── codeql.yml                      # Analyse statique CodeQL automatique (push & pull_request)
    ├── security-audit.yml              # Détection proactive de secrets & contrôle de la politique CSP
    └── quality-ci.yml                  # Validation HTML/CSS/JS, accessibilité, liens & syntaxe
```
