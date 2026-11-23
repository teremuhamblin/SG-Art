# 🚀 Utilisation du projet SG@Art (`v10.0.0`)

## ⚙️ Installation & Lancement sécurisé

> [!WARNING]
> **Ne pas ouvrir `index.html` directement (`file://`) :** Les API **WebGPU**, **WebXR** et la politique de sécurité **CSP** nécessitent un contexte sécurisé (*Secure Context*).

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/<votre-compte>/SG-Art.git
   cd SG-Art
   ```

2. **Démarrer un serveur HTTP local** (*sans installation requise*) :
# Option 1 — *Node.js* (recommandé)
* **npx serve**
# Option 2 — *Python 3*
* **python3 -m http.server 8080**

3. **Accéder à l'Atelier** :
- ouvrez **http://localhost:8080** (ou le port indiqué dans votre terminal) dans un navigateur moderne (Chrome/Edge, Safari 26+, Firefox).

4. **Exploiter ou étendre le Studio** :
- générez vos motifs par seed dans l'*Atelier Neural*, basculez en *Holo‑Gallery WebXR* ou exportez vos patrons en *SVG, JSON ou glTF/USDZ*.

### 🎨 Personnalisation
* **v10.0.0**
- Thème & Design System (style.css) :
   - Adaptez les jetons CSS du thème « Quantum Obsidian & BlueViolet » (#8A2BE2, #0B0714, #140B29, #00E5FF, #F4EFE6) et la typographie (Syne, Plus Jakarta Sans, JetBrains Mono) au sein des @layer.
   - Préservez les ratios de contraste WCAG 2.2 AAA et les règles @media (prefers-reduced-motion)

- Moteurs & Paramètres (script.js) :
   - Personnalisez les seeds, types de nœuds et paramètres de corde dans le Neural Pattern Engine v10 et l'Autonomous Pro Studio.
   - Conservez les replis automatiques WebGPU → WebGL2 / Canvas 2D ainsi que la mise en veille GPU hors‑focus (Page Visibility API).
 
- Assets & Fibres (images/) :
   - Ajoutez ou remplacez les logos, badges v10.0.0, SVG animés et textures de fibres (coton écru, lin, fibres holographiques).
   - Structure & Sécurité (index.html) :
Personnalisez le balisage HTML tout en conservant les attributs d'accessibilité ARIA et la CSP stricte (default-src 'self', aucun script externe non approuvé).

###### ***Toute personnalisation ou diffusion reste soumise aux conditions de la Licence SG-Art v14.04 (attribution obligatoire à SG@Art / Teremu).***
