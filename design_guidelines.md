{
  "brand": {
    "name": "Jack Stallion Enterprise — AI Mastery",
    "attributes": [
      "premium",
      "executive",
      "high-trust",
      "gameful-but-not-gamified-cheap",
      "dark-only",
      "serif-led editorial authority + mono data precision"
    ],
    "non_negotiables": [
      "Dark backgrounds ONLY (never white/light surfaces)",
      "Use exact Brand Bible colors",
      "Headlines: Playfair Display (serif)",
      "Body: Libre Baskerville (serif)",
      "Labels/Nav/Tags/Data: DM Mono (monospace, CAPS + tracking)",
      "No external images (Unicode/CSS decorative elements only)",
      "Gold sparkle effects on achievements",
      "Teal pulse animations on interactive elements",
      "Gold Rule: 60px x 2px gold divider below every section title",
      "NO purple gradients; avoid generic AI aesthetics",
      "All interactive + key informational elements MUST include data-testid"
    ]
  },

  "design_tokens": {
    "css_custom_properties": {
      "instructions": [
        "Implement these tokens in /app/frontend/src/index.css under @layer base :root and .dark.",
        "Set html/body to dark by default (apply .dark on <html> or root wrapper).",
        "Replace current shadcn light defaults (currently :root is white).",
        "Do not use transition: all anywhere."
      ],
      "tokens": {
        "--jse-bg": "#0A0C0F",
        "--jse-bg-alt": "#111419",
        "--jse-card": "#181C24",
        "--jse-elev": "#1E242F",
        "--jse-text": "#C8CDD8",
        "--jse-muted": "#6B7280",
        "--jse-gold": "#C9A84C",
        "--jse-gold-light": "#E8C96B",
        "--jse-gold-dark": "#9B7B2E",
        "--jse-teal": "#00B4C4",
        "--jse-teal-dark": "#007A8A",
        "--jse-teal-deep": "#004F5C",

        "--background": "210 25% 5%",
        "--foreground": "220 18% 82%",
        "--card": "222 22% 12%",
        "--card-foreground": "220 18% 82%",
        "--popover": "222 22% 12%",
        "--popover-foreground": "220 18% 82%",

        "--primary": "174 100% 38%",
        "--primary-foreground": "210 25% 5%",
        "--secondary": "220 18% 14%",
        "--secondary-foreground": "220 18% 82%",
        "--muted": "220 18% 14%",
        "--muted-foreground": "220 9% 55%",
        "--accent": "43 52% 55%",
        "--accent-foreground": "210 25% 5%",

        "--border": "220 18% 18%",
        "--input": "220 18% 18%",
        "--ring": "174 100% 38%",

        "--radius": "14px",
        "--radius-sm": "10px",
        "--radius-lg": "18px",

        "--shadow-1": "0 1px 0 rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.45)",
        "--shadow-2": "0 1px 0 rgba(255,255,255,0.06), 0 18px 50px rgba(0,0,0,0.55)",

        "--focus-ring": "0 0 0 3px rgba(0,180,196,0.22)",
        "--focus-ring-gold": "0 0 0 3px rgba(201,168,76,0.22)",

        "--noise-opacity": "0.06",
        "--gridline-opacity": "0.08"
      }
    },

    "tailwind_usage": {
      "notes": [
        "Prefer Tailwind for layout/spacing; use CSS vars for colors to keep brand consistent.",
        "Use bg-[color:var(--jse-bg)] style or extend Tailwind theme if desired."
      ],
      "recommended_color_util_patterns": [
        "bg-[color:var(--jse-bg)]",
        "bg-[color:var(--jse-bg-alt)]",
        "bg-[color:var(--jse-card)]",
        "border-[color:var(--jse-gold-dark)]",
        "text-[color:var(--jse-text)]",
        "text-[color:var(--jse-muted)]",
        "text-[color:var(--jse-gold)]",
        "text-[color:var(--jse-teal)]"
      ]
    }
  },

  "typography": {
    "google_fonts": {
      "imports": [
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Libre+Baskerville:wght@400;700&family=DM+Mono:wght@400;500&display=swap"
      ],
      "implementation": [
        "Add @import at top of /app/frontend/src/index.css OR include <link> in index.html.",
        "Set body font-family to Libre Baskerville; headings to Playfair Display; labels/nav to DM Mono."
      ]
    },
    "font_families": {
      "display": "'Playfair Display', Georgia, serif",
      "body": "'Libre Baskerville', Georgia, serif",
      "mono": "'DM Mono', 'Courier New', monospace"
    },
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.02em]",
      "h2": "text-base md:text-lg font-normal text-[color:var(--jse-text)]/90",
      "section_title": "text-2xl md:text-3xl font-semibold",
      "body": "text-sm md:text-base leading-relaxed",
      "small": "text-xs md:text-sm",
      "label_caps": "font-[family:var(--font-mono)] uppercase tracking-[0.18em] text-xs"
    },
    "section_title_divider": {
      "rule": "60px x 2px gold divider below every section title",
      "tailwind": "mt-3 h-[2px] w-[60px] bg-[color:var(--jse-gold)]"
    }
  },

  "layout": {
    "grid": {
      "app_shell": {
        "desktop": "Sidebar (280px) + content (fluid) with max-w-[1200px] inner content rail",
        "mobile": "Bottom sheet / drawer navigation (shadcn Drawer/Sheet) + top sticky header"
      },
      "content_rails": {
        "primary": "max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8",
        "dense": "max-w-[980px] mx-auto px-4 sm:px-6"
      },
      "dashboard_sections": [
        "Hero welcome + next recommended exercise",
        "Progress + tier unlock status",
        "Today’s drills (timed challenges)",
        "Builders (RACE, constraints, ROI)",
        "Kanban + compliance calendar"
      ]
    },
    "spacing": {
      "principle": "Use 2–3x more spacing than feels comfortable; premium = breathing room.",
      "section_padding": "py-10 md:py-14",
      "card_padding": "p-5 md:p-6",
      "stack_gaps": "gap-4 md:gap-6"
    }
  },

  "visual_style": {
    "background_treatments": {
      "rule": "No images. Use CSS-only noise + subtle gridlines + vignette.",
      "css_scaffold": [
        "Create a .jse-noise-layer pseudo-element on the app root:",
        "background-image: radial-gradient(rgba(255,255,255,var(--gridline-opacity)) 1px, transparent 1px); background-size: 24px 24px;",
        "overlay a noise via repeating-radial-gradient or SVG data-uri (optional) with opacity var(--noise-opacity).",
        "Keep overlays subtle; do not reduce text contrast."
      ]
    },
    "surfaces": {
      "cards": {
        "base": "bg-[color:var(--jse-card)] border border-white/5 rounded-[var(--radius)] shadow-[var(--shadow-1)]",
        "hover": "hover:border-[color:var(--jse-gold-dark)]/60 hover:shadow-[var(--shadow-2)]",
        "motion": "transition-[box-shadow,border-color,background-color] duration-200"
      },
      "elevated": {
        "use_for": ["sticky headers", "popover content", "drawer/sheet"],
        "class": "bg-[color:var(--jse-elev)] border border-white/6"
      }
    },
    "dividers": {
      "default": "border-white/8",
      "gold_accent": "bg-[color:var(--jse-gold)]"
    }
  },

  "components": {
    "component_path": {
      "navigation": [
        "/app/frontend/src/components/ui/sheet.jsx",
        "/app/frontend/src/components/ui/scroll-area.jsx",
        "/app/frontend/src/components/ui/navigation-menu.jsx",
        "/app/frontend/src/components/ui/separator.jsx",
        "/app/frontend/src/components/ui/badge.jsx",
        "/app/frontend/src/components/ui/tooltip.jsx"
      ],
      "dashboard": [
        "/app/frontend/src/components/ui/card.jsx",
        "/app/frontend/src/components/ui/progress.jsx",
        "/app/frontend/src/components/ui/tabs.jsx",
        "/app/frontend/src/components/ui/button.jsx",
        "/app/frontend/src/components/ui/skeleton.jsx"
      ],
      "paywall": [
        "/app/frontend/src/components/ui/dialog.jsx",
        "/app/frontend/src/components/ui/alert-dialog.jsx",
        "/app/frontend/src/components/ui/hover-card.jsx",
        "/app/frontend/src/components/ui/badge.jsx",
        "/app/frontend/src/components/ui/button.jsx"
      ],
      "exercises_and_games": [
        "/app/frontend/src/components/ui/resizable.jsx",
        "/app/frontend/src/components/ui/slider.jsx",
        "/app/frontend/src/components/ui/toggle-group.jsx",
        "/app/frontend/src/components/ui/textarea.jsx",
        "/app/frontend/src/components/ui/command.jsx",
        "/app/frontend/src/components/ui/progress.jsx",
        "/app/frontend/src/components/ui/tooltip.jsx"
      ],
      "kanban_and_tables": [
        "/app/frontend/src/components/ui/card.jsx",
        "/app/frontend/src/components/ui/dropdown-menu.jsx",
        "/app/frontend/src/components/ui/input.jsx",
        "/app/frontend/src/components/ui/textarea.jsx",
        "/app/frontend/src/components/ui/badge.jsx"
      ],
      "calendar_compliance": [
        "/app/frontend/src/components/ui/calendar.jsx",
        "/app/frontend/src/components/ui/popover.jsx",
        "/app/frontend/src/components/ui/select.jsx"
      ],
      "toasts": [
        "/app/frontend/src/components/ui/sonner.jsx"
      ]
    },

    "app_shell": {
      "sidebar": {
        "structure": [
          "Top: Brand mark (CSS-only monogram) + course name",
          "Tier list with lock/unlock indicators",
          "Quick actions: Search glossary, New exercise, ROI calculator",
          "Footer: account + tier badge"
        ],
        "tier_row": {
          "classes": "group flex items-center justify-between rounded-[12px] px-3 py-2 bg-white/0 hover:bg-white/3 transition-[background-color] duration-150",
          "left": "DM Mono label (caps) + small tier subtitle",
          "right": "lucide icon: Lock (muted) OR CheckCircle2 (gold) OR Sparkles (gold for newly unlocked)",
          "testids": {
            "tier_row": "sidebar-tier-row",
            "tier_lock_icon": "sidebar-tier-lock-icon",
            "tier_unlocked_icon": "sidebar-tier-unlocked-icon"
          }
        }
      },
      "mobile_nav": {
        "pattern": "Use Sheet from left; trigger in sticky header.",
        "testids": {
          "open_nav": "mobile-nav-open-button",
          "close_nav": "mobile-nav-close-button"
        }
      }
    },

    "section_header": {
      "pattern": "Section title (Playfair) + 60x2 gold divider + optional mono eyebrow",
      "eyebrow": "text-xs font-[family:var(--font-mono)] uppercase tracking-[0.18em] text-[color:var(--jse-muted)]",
      "title": "text-2xl md:text-3xl font-semibold text-[color:var(--jse-text)]",
      "divider": "h-[2px] w-[60px] bg-[color:var(--jse-gold)]",
      "testids": {
        "section_title": "section-title",
        "section_divider": "section-title-divider"
      }
    },

    "buttons": {
      "style": "Professional / Corporate with premium metal accents",
      "variants": {
        "primary_teal": {
          "use_for": ["Start exercise", "Submit", "Run Claude"],
          "classes": "bg-[color:var(--jse-teal)] text-[color:var(--jse-bg)] hover:bg-[color:var(--jse-teal-dark)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] transition-[background-color,box-shadow] duration-150",
          "radius": "rounded-[12px]"
        },
        "cta_gold": {
          "use_for": ["Unlock This Level", "Upgrade"],
          "classes": "bg-[color:var(--jse-gold)] text-[color:var(--jse-bg)] hover:bg-[color:var(--jse-gold-light)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring-gold)] transition-[background-color,box-shadow] duration-150",
          "radius": "rounded-[12px]"
        },
        "secondary": {
          "use_for": ["Preview", "Save draft"],
          "classes": "bg-white/0 border border-white/10 text-[color:var(--jse-text)] hover:bg-white/4 hover:border-white/16 transition-[background-color,border-color] duration-150",
          "radius": "rounded-[12px]"
        },
        "ghost": {
          "use_for": ["Icon actions", "Inline controls"],
          "classes": "bg-transparent hover:bg-white/4 text-[color:var(--jse-text)] transition-[background-color] duration-150",
          "radius": "rounded-[10px]"
        }
      },
      "sizes": {
        "sm": "h-9 px-3 text-sm",
        "md": "h-10 px-4 text-sm",
        "lg": "h-11 px-5 text-base"
      },
      "testids": {
        "primary": "primary-action-button",
        "unlock": "paywall-unlock-button",
        "secondary": "secondary-action-button"
      }
    },

    "paywall_gate": {
      "pattern": "Blurred preview card + gold lock plate + tier/price + CTA",
      "blur": {
        "classes": "relative overflow-hidden",
        "content_blur": "filter blur-[6px] opacity-70 select-none pointer-events-none",
        "overlay": "absolute inset-0 bg-[color:var(--jse-bg)]/35 backdrop-blur-[2px]"
      },
      "lock_plate": {
        "classes": "absolute inset-x-4 bottom-4 rounded-[14px] border border-[color:var(--jse-gold-dark)]/70 bg-[color:var(--jse-elev)]/92 p-4 shadow-[var(--shadow-2)]",
        "title": "font-[family:var(--font-mono)] uppercase tracking-[0.18em] text-xs text-[color:var(--jse-gold)]",
        "price": "text-sm text-[color:var(--jse-text)]",
        "icon": "lucide LockKeyhole"
      },
      "testids": {
        "gate": "paywall-gate",
        "blur_preview": "paywall-blur-preview",
        "tier_name": "paywall-tier-name",
        "tier_price": "paywall-tier-price"
      }
    },

    "mini_games": {
      "drag_and_drop": {
        "ui": [
          "Use Card surfaces for draggable items; add teal pulse ring on draggable hover.",
          "Drop zones: dashed border in teal-deep tint; on valid hover, border becomes teal + subtle glow.",
          "On drop success: quick scale-in + gold tick flash; on perfect score: gold sparkle burst."
        ],
        "classes": {
          "draggable": "rounded-[14px] bg-[color:var(--jse-card)] border border-white/8 px-4 py-3 cursor-grab active:cursor-grabbing transition-[box-shadow,border-color] duration-150 hover:border-[color:var(--jse-teal)]/60",
          "dropzone": "rounded-[16px] border border-dashed border-[color:var(--jse-teal-deep)] bg-[color:var(--jse-teal-deep)]/10 p-4 transition-[border-color,box-shadow,background-color] duration-150",
          "dropzone_active": "border-[color:var(--jse-teal)] shadow-[0_0_0_3px_rgba(0,180,196,0.14)] bg-[color:var(--jse-teal-deep)]/18"
        },
        "testids": {
          "draggable_item": "dnd-draggable-item",
          "dropzone": "dnd-dropzone"
        }
      },
      "timed_challenges": {
        "ui": [
          "Timer uses DM Mono; animate number changes with spring.",
          "Progress bar uses teal fill; when <10s, switch to gold fill (no red panic)."
        ],
        "testids": {
          "timer": "challenge-timer",
          "score": "challenge-score",
          "start": "challenge-start-button"
        }
      },
      "score_celebrations": {
        "gold_sparkle": {
          "rule": "CSS-only sparkles (no images). Use pseudo-elements + radial-gradients.",
          "implementation": [
            "Create a SparkleBurst component that renders 8–12 absolutely-positioned spans.",
            "Each span uses background: radial-gradient(circle, var(--jse-gold-light), transparent 60%).",
            "Animate with keyframes: translate outward + fade + slight rotate.",
            "Trigger only on perfect score to keep it special."
          ],
          "testids": {
            "sparkle": "achievement-sparkle-burst"
          }
        }
      }
    },

    "data_viz": {
      "recharts": {
        "style": [
          "Charts sit on card surfaces; axes/ticks in muted; primary series teal; secondary series gold.",
          "Tooltips use elevated surface with gold border.",
          "Avoid gradients in chart fills; use solid with 0.18–0.28 opacity area fills."
        ],
        "palette": {
          "series_primary": "#00B4C4",
          "series_secondary": "#C9A84C",
          "grid": "rgba(255,255,255,0.06)",
          "tick": "#6B7280"
        },
        "testids": {
          "chart": "dashboard-chart"
        }
      }
    }
  },

  "motion": {
    "libraries": {
      "recommended": [
        {
          "name": "framer-motion",
          "why": "Premium reveals, score springs, tier unlock animations, drag feedback.",
          "install": "npm i framer-motion",
          "usage_notes": [
            "Use motion.div for card entrance (opacity + y).",
            "Use layout animations for kanban moves.",
            "Respect prefers-reduced-motion."
          ]
        }
      ]
    },
    "principles": [
      "Entrance: 180–240ms, ease-out; stagger lists 40–70ms.",
      "Hover: 120–160ms; only animate background-color, border-color, box-shadow, opacity.",
      "Score changes: spring (stiffness ~260, damping ~22).",
      "Teal pulse: 1.6–2.2s breathing ring on interactive hotspots.",
      "Tier unlock: gold shimmer sweep (subtle) + sparkle burst once."
    ],
    "keyframes_scaffold": {
      "teal_pulse": "@keyframes tealPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(0,180,196,0.0);} 50% { box-shadow: 0 0 0 4px rgba(0,180,196,0.18);} }",
      "gold_shimmer": "@keyframes goldShimmer { 0% { background-position: -120% 0; } 100% { background-position: 220% 0; } }",
      "sparkle": "@keyframes sparkleOut { 0% { transform: translate(0,0) scale(0.6); opacity: 0; } 15% { opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(1.1); opacity: 0; } }"
    }
  },

  "accessibility": {
    "rules": [
      "WCAG AA contrast: body text #C8CDD8 on #0A0C0F is OK; ensure muted text is not used for critical info.",
      "Focus states must be visible: use teal ring for primary interactions; gold ring for paywall/upgrade CTAs.",
      "Keyboard: all drag-and-drop exercises must have an alternate keyboard mode (select item -> choose target).",
      "Reduced motion: disable sparkle bursts and reduce pulse intensity when prefers-reduced-motion is set.",
      "Hit targets: min 44px for primary controls on mobile."
    ],
    "aria": [
      "Lock icons must have aria-label describing locked tier.",
      "Progress bars must include aria-valuenow/aria-valuemax.",
      "Dialogs must trap focus (shadcn Dialog already handles)."
    ]
  },

  "image_urls": {
    "rule": "No external images allowed. Use CSS/Unicode decorative elements only.",
    "categories": [
      {
        "category": "brand_mark",
        "description": "CSS-only monogram (e.g., 'JS' ligature) inside a gold-outlined square with subtle inner glow.",
        "urls": []
      },
      {
        "category": "achievement_effects",
        "description": "CSS-only sparkle burst using radial-gradients and pseudo-elements.",
        "urls": []
      }
    ]
  },

  "instructions_to_main_agent": [
    "Update /app/frontend/src/index.css to use JSE dark tokens by default; remove the current white :root token set.",
    "Do NOT use App.css centered header styles; delete or ignore CRA demo styles in /app/frontend/src/App.css.",
    "Implement an AppShell layout: Sidebar (desktop) + Sheet (mobile) + content rail.",
    "Every section header must include the 60x2 gold divider.",
    "Use shadcn/ui components from /app/frontend/src/components/ui (JSX) only for dropdowns, dialogs, calendar, etc.",
    "Add data-testid to: nav items, tier rows, paywall CTA, exercise start/submit, timers, scores, charts, kanban columns/cards, glossary search input.",
    "Add Framer Motion for premium motion; ensure prefers-reduced-motion support.",
    "Implement paywall gates with blurred previews + gold lock plate overlay.",
    "Mini-games: add teal pulse on interactive elements; gold sparkle burst only on perfect scores.",
    "Keep gradients minimal and decorative only; given brand is dark-only, prefer solid surfaces with subtle noise/grid overlays instead of gradients."
  ]
}

<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
