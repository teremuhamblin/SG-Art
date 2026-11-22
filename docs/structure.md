# 📄 SG@Art
### v10.0.0
### Structure du projet SG-Art
```text
SG-Art/
│── index.html   🌐 — Interface sémantique, CSP & Atelier Neural
│── style.css    🎨 — Design System Quantum‑Era (@layer, A11y)
│── script.js    ⚙️ — Moteurs IA, WebGPU (+fallback), XR & Export
│── images/      🖼️ — Logos, badges v1.2.0, textures fibres & SVG animés
│── docs/        📚 — Architecture, Changelog, Guides WebGPU/XR & Sécurité
│── .github/     🔧 — Workflows CI/CD, CodeQL, Dependabot & Templates
│── LICENSE      📜 — Licence SG-Art v14.04
│── README.md    📖 — Présentation principale
```

### 📂 Details de l'arborescence 
- index.html : structure principale du site  
- style.css : design visuel, couleurs, animations  
- script.js : interactions simples  
- images/ : logo, badges, SVG animés  
- docs/ : documentation du projet  
- .github/ : gouvernance, sécurité, templates  

---

### 📂 Arborescence
- .github/ proposée (sur la base de votre README)

D'après la section 8. Structure, Sécurité & Éco‑Conception et vos matrices de compatibilité, voici la structure complète que je peux générer et adapter à vos règles :

```text
.github/
├── CODEOWNERS                         # Responsables de validation par périmètre (Core, Neural, WebGPU, Docs)
├── CODE_OF_CONDUCT.md                 # Code de conduite (ou renvoi/fusion selon votre fichier)
├── CONTRIBUTING.md                    # Guide de contribution (normes CSP, ARIA, WebGPU fallback, commits)
├── SECURITY.md                        # Politique Zero-Trust, signalement de failles & périmètre CSP
├── SUPPORT.md                         # Canal d'aide & matrice navigateurs / WebXR
├── PULL_REQUEST_TEMPLATE.md           # Checklist PR (CSP, CodeQL, WCAG 2.2, Sleep GPU, fallback 2D/WebGL2)
├── dependabot.yml                     # Surveillance des dépendances & GitHub Actions
├── ISSUE_TEMPLATE/
│   ├── config.yml                     # Liens directs (Sécurité, Docs, Discussions)
│   ├── bug_report.yml                 # Formulaire structuré (Navigateur, GPU/WebGPU, WebXR, Seed)
│   └── feature_request.yml            # Proposition d'évolution (Neural Engine, Studio, Holo-Gallery)
└── workflows/
    ├── codeql.yml                     # Analyse statique CodeQL (push & pull_request)
    ├── security-audit.yml             # Détection de secrets (Gitleaks/TruffleHog) + vérification CSP
    └── quality-ci.yml                 # Lint, validation HTML/CSS/JS/JSON, liens Markdown & accessibilité
```
