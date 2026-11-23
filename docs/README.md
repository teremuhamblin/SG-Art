# 📚 SG@Art — Documentation (`v10.0.0`)

Ce dossier `docs/` regroupe la documentation technique et artistique de **SG@Art** (*Neural Macramé Quantum‑Era*), une **plateforme neuro‑artistique autonome** dédiée à la création, la simulation physique **WebGPU** et l'exposition spatiale **WebXR** d'œuvres de macramé.

---

## 🗂️ Contenu du dossier `docs/`

| Document | Description |
| :--- | :--- |
| **[`overview.md`](./overview.md)** | Vision, positionnement *Neural Macramé Quantum‑Era* et capacités clés `v10.0.0` |
| **[`structure.md`](./structure.md)** | Architecture complète du dépôt (`index.html`, `style.css`, `script.js`, `.github/`) |
| **[`usage.md`](./usage.md)** | Lancement local sécurisé (`localhost` / `HTTPS`), personnalisation et exports |
| **[`design.md`](./design.md)** | Design System *Quantum Obsidian & BlueViolet*, typographie, animations et WCAG 2.2 |

*(Voir aussi à la racine : [`README.md`](../README.md) • [`LICENSE` (SG‑Art v14.04)](../LICENSE) • [`CONTRIBUTING.md`](../.github/CONTRIBUTING.md) • [`SECURITY.md`](../.github/SECURITY.md))*

---

## 🎯 Objectifs

- **Documenter l'architecture `v10.0.0` :** expliquer le fonctionnement modulaire du *Neural Pattern Engine v10*, de l'*Autonomous Pro Studio*, du moteur *Quantum‑Mesh* (**WebGPU** + repli **WebGL2/Canvas 2D**) et de la *Holo‑Gallery* **WebXR**.
- **Consigner les standards techniques et artistiques :** Design System, accessibilité **WCAG 2.2 AAA** / **ARIA**, sobriété énergétique (**veille GPU**, `prefers-reduced-motion`) et sécurité **Zero‑Trust** (**CSP stricte**, **CodeQL**).
- **Faciliter l'évolution et les contributions :** fournir un socle clair pour la personnalisation, les exports (**SVG**, **JSON**, **glTF/USDZ**) et la maintenance communautaire.

---

## 🧩 Fichiers principaux de la plateforme

- **`index.html`** — Structure HTML5 sémantique (**ARIA**), politique de sécurité **CSP stricte** (`default-src 'self'`) et points de montage Studio / WebXR.
- **`style.css`** — Design System *Quantum Obsidian & BlueViolet* organisé en `@layer`, contrastes **WCAG 2.2 AAA** et gestion de `prefers-reduced-motion`.
- **`script.js`** — Moteurs autonomes (IA générative par *seed*, simulation physique *Quantum‑Mesh* WebGPU avec repli automatique, réalité spatiale WebXR, mise en veille GPU et exports multi‑formats).

---

## 📌 Statut

**Documentation consolidée — Édition `v10.0.0` Stable** (aboutissement complet de la feuille de route `v1.0 → v10.0`, alignée avec les pipelines CI/CD et les règles de gouvernance du dossier `.github/`).
