# Clanger.au — Brand Guidelines

## Brand Name
**Clanger.au**

## Tagline
"Your Court. Your Call."

## Color Palette

### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Background | `#0A0E1A` | Deep navy-black, main page background |
| Secondary Background | `#111827` | Dark charcoal, section backgrounds |
| Card Background | `#1A1F2E` | Elevated dark, card surfaces |

### Accents
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Accent | `#3B82F6` | Electric blue, primary actions and highlights |
| Secondary Accent | `#60A5FA` | Lighter blue, secondary elements |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Success/Win | `#10B981` | Green, positive outcomes |
| Danger/Loss | `#EF4444` | Red, negative outcomes |
| Warning | `#F59E0B` | Amber, caution states |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| Text Primary | `#F9FAFB` | Near-white, headings and body |
| Text Secondary | `#9CA3AF` | Muted gray, supporting text |
| Text Tertiary | `#6B7280` | Darker gray, labels and metadata |

### Borders & Surfaces
| Token | Hex | Usage |
|-------|-----|-------|
| Border | `#1F2937` | Subtle dark border |
| Gradient Accent | `linear-gradient(135deg, #3B82F6, #8B5CF6)` | Premium elements — use sparingly |

## Typography
- **Primary Font:** Satoshi (Bold, Medium, Regular)
- **Never use:** Inter, Roboto, Arial, or other generic AI fonts
- Distinctive, modern sports-tech feel

## Theme
- **Dark mode is the ONLY theme.** Never build light mode.
- Never use purple gradients on white backgrounds.

## Card Style
- `rounded-xl` (12px border radius)
- Subtle border using `#1F2937`
- Slight `backdrop-blur` on elevated surfaces

## Spacing
- **Base unit:** 4px
- **Scale:** 4, 8, 12, 16, 24, 32, 48, 64

## Border Radius
- **Buttons/Inputs:** `rounded-lg` (8px)
- **Cards:** `rounded-xl` (12px)
- **Avatars/Badges:** `rounded-full`

## Logo
- Located at `/brand_assets/logo.svg` (or `.png`)
- Fallback: Text "CLANGER" in Satoshi Bold with primary accent color `#3B82F6`

## Content Tone
- Confident, not arrogant
- Sports-native language (not corporate/SaaS speak)
- Action-oriented CTAs: "Draft Your Squad", "Enter the Contest", "Watch Live"
- Competitive but friendly
- Clear explanation of skill-based contest format

## Interactive States
Every interactive element must have:
- **Hover** state
- **Focus** state
- **Active** state
- **Disabled** state

## Loading & Empty States
- Use **skeleton loading states**, not spinners
- All empty states must have helpful messaging and illustration

## Notifications
- Use **toast notifications** for user actions
