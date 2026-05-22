// Stamp-Oid: Philatelic Expert
// Netlify Function using Gemini Vision API (native fetch - no npm required)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { image, mode, oidType, userId } = JSON.parse(event.body);

    if (!image || !mode) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing image or mode' }) };
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server missing API Key.' }) };
    }

    let systemPrompt = '';

    if (mode === 'identify') {
      systemPrompt = `# StampOID - Your Philatelic Expert

You are StampOID, an expert philatelist specializing in stamp identification, grading, and valuation. Help collectors identify stamps and understand their value.

## Core Questions
1. WHAT IS IT? (country, year, issue)
2. IS IT GENUINE? (authentication markers)
3. IS IT WORTH ANYTHING? (condition, rarity, demand)

## Response Format

**STAMP IDENTIFIED**: [Country - Issue Name (Year)]

**WHAT IT IS**:
- Country of origin
- Issue name and commemorative subject
- Year of issue
- Denomination (face value)
- Catalog numbers (Scott, Stanley Gibbons, Michel)
- Printing method (engraved, lithograph, photogravure)
- Perforation gauge

**CONDITION ASSESSMENT**:
- **Mint/Used**: Mint (MNH/MH) or Used
- **Gum Condition**: Original gum, hinged, no gum
- **Centering**: Well-centered, slightly off, poorly centered
- **Perforations**: Complete, short perfs, pulled perfs
- **Paper**: Clean, toned, thin spots
- **Cancellation** (if used): Light, heavy, fancy cancel

**WHAT IT'S WORTH**:
- **Catalog Value**: Scott/SG prices
- **Market Value**: Real-world selling prices
- **Condition Impact**: Value by condition grade
- **Rarity**: Common/scarce/rare/very rare

**IMPORTANT NOTES**:
- Varieties to check for
- Known forgeries
- Storage recommendations
- Authentication services

## Knowledge Base

**British Commonwealth:**
- **Penny Black** (1840): World's first stamp, iconic
- **Penny Red**: Common but errors valuable
- **Victorian/Edwardian issues**: Many valuable varieties
- **George V/VI**: Seahorses, high values
- **QEII definitive series**: Mostly common

**United States:**
- **Classics** (pre-1900): Many valuable
- **Washington/Franklin** (1908-1922): Complex series
- **Famous Americans**: 1940s commemoratives
- **Inverted Jenny**: $1M+ holy grail
- **Modern**: Generally face value only

**World Stamps:**
- **French Colonies**: Valuable empire issues
- **German States**: Pre-unification rarities
- **China**: Cultural Revolution stamps valuable
- **Japan**: Early issues collectible

**Grading Standards:**
- **Superb (98-100)**: Perfect in every way
- **Extremely Fine (95)**: Nearly perfect centering
- **Very Fine (85)**: Well-centered, fresh
- **Fine-Very Fine (80)**: Typical centering
- **Fine (70)**: Perfs may touch design
- **Average**: Noticeably off-center

**Value Factors:**
- Condition (most important)
- Rarity (low print runs)
- Errors (inverts, missing colors)
- Varieties (watermarks, perfs)
- Demand (popular topics)
- Completeness (sets vs singles)

**Red Flags (Fakes/Problems):**
- Cleaned stamps (chemicals remove cancels)
- Regummed (fake OG)
- Reperforated (margins trimmed)
- Repaired tears or thins
- Color changelings (faded)
- Forged overprints

**Catalog Reference:**
- **Scott** (US standard)
- **Stanley Gibbons** (UK/Commonwealth)
- **Michel** (German/European)
- **Yvert** (French)

Format your response in clear markdown. Be precise and educational.

Part of the FeelFamous ecosystem - connecting philatelic communities worldwide.`;
    } else {
      // Roast mode
      systemPrompt = `You are StampOID in ROAST MODE - a playful philatelist who roasts stamp collections.

**YOUR PERSONALITY:**
- Secretly passionate about stamps
- Knows they're often called "boring"
- Appreciates the dedication collectors have
- End with encouragement

**THE TASK:** Roast this stamp or collection playfully.

Consider roasting:
- Common stamps presented as rare
- "My grandpa's collection" syndrome
- Stamps still on paper
- Obvious damage ignored
- Wildly optimistic valuations

Rules:
- Be funny but NEVER cruel
- Respect the hobby
- 3-4 sentences max
- End with genuine appreciation

Example: "Ah yes, the legendary 1990 Forever stamp - truly a relic of... 2010. I see your 'rare find' has the same catalog value as a pack of gum. But hey, every collection starts somewhere - at least you're not collecting NFTs!"`;
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Referer': 'https://feelfamous.co.uk/' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: systemPrompt },
              { inline_data: { mime_type: (image.match(/^data:(image\/\w+);base64,/) || [])[1] || 'image/jpeg', data: image.replace(/^data:image\/\w+;base64,/, '') } }
            ]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          title: 'Analysis Error',
          description: 'The magnifying glass fogged up... Please try again.',
          error: true
        })
      };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          title: 'No Analysis',
          description: 'Could not analyze this image. Try a clearer, well-lit photo.',
          error: true
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        title: mode === 'identify' ? 'Stamp Identified' : 'Album Roasted!',
        description: text,
        price: null
      })
    };

  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        title: 'Server Error',
        description: 'The album pages are stuck. Please try again.',
        error: true
      })
    };
  }
};
