const vibeKeywords = {
    positive: {
        keywords: ['happy', 'love', 'amazing', 'awesome', 'great', 'wonderful', 'fantastic', 'excellent', 'perfect', 'blessed', 'grateful', 'joy', 'smile', 'laugh', 'celebration', 'success', 'win', 'victory', 'achievement', 'beautiful', 'incredible', 'outstanding', 'marvelous', 'brilliant', 'superb', 'delighted', 'thrilled', 'ecstatic', 'cheerful', 'optimistic', 'radiant', 'glowing', 'euphoric', 'blissful', 'content', 'satisfied', 'pleased', 'uplifted', 'heartwarming', 'magnificent', 'spectacular', 'phenomenal', 'extraordinary', 'divine', 'heavenly', 'paradise', 'sunshine', 'rainbow', 'miracle'],
        hashtags: ['#happy', '#blessed', '#grateful', '#love', '#amazing', '#perfect', '#success', '#winning', '#celebration', '#joy', '#smile', '#positive', '#happiness', '#bliss', '#wonderful', '#fantastic', '#excellent', '#beautiful', '#incredible', '#goodvibes', '#positivity', '#blessed🙏', '#grateful❤️', '#joyful', '#optimistic'],
        emojis: ['😊', '😀', '😁', '😄', '😃', '🥳', '🎉', '🎊', '❤️', '💕', '😍', '🤩', '✨', '🌟', '💫', '🌈', '☀️', '🌞', '💖', '💝', '🎈', '🎁', '🍀', '🌺', '🌸', '🦄', '💐', '🥰', '😘', '💓', '💗'],
        weight: 1.0,
        color: '#10B981',
        icon: '😊'
    },
    motivational: {
        keywords: ['motivation', 'inspire', 'goals', 'hustle', 'grind', 'work', 'fitness', 'gym', 'workout', 'training', 'challenge', 'push', 'strong', 'power', 'determination', 'focus', 'mindset', 'growth', 'discipline', 'persistence', 'dedication', 'commitment', 'ambition', 'driven', 'unstoppable', 'fearless', 'brave', 'courage', 'warrior', 'fighter', 'champion', 'beast', 'machine', 'legend', 'crushing', 'dominating', 'achieving', 'conquering', 'breakthrough', 'transformation', 'evolution', 'progress', 'improvement', 'excellence', 'mastery', 'elite', 'peak', 'maximum', 'intense', 'hardcore', 'relentless', 'never give up', 'rise up', 'level up', 'step up', 'boss up', 'grind mode', 'beast mode', 'work hard', 'stay focused', 'keep going', 'no excuses', 'no limits'],
        hashtags: ['#motivation', '#inspire', '#goals', '#hustle', '#grind', '#fitness', '#gym', '#workout', '#strong', '#power', '#mindset', '#growth', '#challenge', '#determination', '#discipline', '#dedication', '#unstoppable', '#fearless', '#warrior', '#champion', '#beastmode', '#grindmode', '#noexcuses', '#nolimits', '#levelup', '#riseup', '#staystrong', '#nevergiveup', '#workhard', '#stayfocused', '#pushyourself', '#breakthrough', '#transformation'],
        emojis: ['💪', '🔥', '⚡', '🎯', '🏆', '🥇', '💯', '🚀', '⭐', '👑', '💎', '🦁', '🥊', '🏋️', '⚔️', '🗡️', '🛡️', '🎖️', '🏅', '🔱', '💥', '⚖️', '🧗', '🏃', '🚴', '🏊'],
        weight: 1.3,
        color: '#F59E0B',
        icon: '💪'
    },
    emotional: {
        keywords: ['sad', 'miss', 'emotional', 'tears', 'cry', 'heart', 'pain', 'hurt', 'difficult', 'struggle', 'hard', 'tough', 'memories', 'remember', 'thinking', 'feel', 'deep', 'soul', 'lonely', 'broken', 'empty', 'lost', 'confused', 'overwhelmed', 'stressed', 'anxious', 'worried', 'scared', 'afraid', 'vulnerable', 'sensitive', 'fragile', 'melancholy', 'nostalgic', 'longing', 'yearning', 'aching', 'grieving', 'mourning', 'sorrowful', 'heartbroken', 'devastated', 'crushed', 'shattered', 'torn', 'bleeding', 'suffering', 'healing', 'recovery', 'reflection', 'introspection', 'contemplation', 'meditation', 'soul-searching'],
        hashtags: ['#emotional', '#feelings', '#deep', '#heart', '#soul', '#memories', '#missing', '#thinking', '#reflection', '#tears', '#sad', '#hurt', '#pain', '#lonely', '#broken', '#lost', '#healing', '#recovery', '#vulnerable', '#sensitive', '#overwhelmed', '#stressed', '#anxious', '#nostalgic', '#heartbroken', '#soulful', '#introspection', '#mentalhealth', '#selfcare'],
        emojis: ['😢', '😭', '💔', '😞', '😔', '🥺', '😪', '💙', '🖤', '🤍', '💭', '🌧️', '⛈️', '🌊', '🕳️', '🥀', '🍂', '🌙', '💤', '😴', '😵', '😶', '🤐', '😷', '🤕', '🩹', '💊'],
        weight: 0.9,
        color: '#6366F1',
        icon: '💔'
    },
    energetic: {
        keywords: ['party', 'fun', 'energy', 'exciting', 'wild', 'crazy', 'adventure', 'dance', 'music', 'vibe', 'lit', 'fire', 'epic', 'insane', 'sick', 'dope', 'cool', 'fresh', 'hot', 'electric', 'explosive', 'dynamic', 'vibrant', 'lively', 'spirited', 'animated', 'enthusiastic', 'exhilarating', 'thrilling', 'pumped', 'hyped', 'charged', 'amped', 'buzzing', 'rocking', 'jamming', 'vibing', 'grooving', 'bouncing', 'jumping', 'dancing', 'celebrating', 'festive', 'carnival', 'festival', 'concert', 'show', 'performance', 'stage', 'spotlight', 'crowd', 'audience', 'applause', 'rhythm', 'beat', 'bass', 'drop', 'remix', 'mashup', 'banger', 'anthem', 'club', 'nightlife', 'weekend', 'turn up', 'let loose', 'go wild', 'live it up'],
        hashtags: ['#party', '#fun', '#energy', '#exciting', '#adventure', '#dance', '#music', '#vibe', '#lit', '#fire', '#epic', '#cool', '#hot', '#wild', '#crazy', '#electric', '#vibrant', '#lively', '#hyped', '#pumped', '#rocking', '#jamming', '#vibing', '#dancing', '#festival', '#concert', '#nightlife', '#weekend', '#turnup', '#letloose', '#gowild', '#liveitup', '#goodtimes', '#partyvibes'],
        emojis: ['🔥', '⚡', '🎶', '🎵', '💃', '🕺', '🎪', '🎭', '🎨', '🌈', '✨', '💥', '🎸', '🥳', '🎤', '🎧', '🎹', '🥁', '🎺', '🎻', '🎷', '🪩', '🎊', '🎆', '🎇', '💫', '🌟', '⭐', '🎬', '🎮', '🎯', '🎲', '🎳'],
        weight: 1.2,
        color: '#EF4444',
        icon: '🔥'
    },
    calm: {
        keywords: ['peaceful', 'calm', 'relax', 'zen', 'meditation', 'nature', 'quiet', 'serene', 'tranquil', 'gentle', 'soft', 'slow', 'breathe', 'mindful', 'present', 'balance', 'harmony', 'stillness', 'silence', 'soothing', 'comforting', 'restful', 'refreshing', 'rejuvenating', 'restorative', 'therapeutic', 'healing', 'centered', 'grounded', 'stable', 'steady', 'composed', 'collected', 'poised', 'graceful', 'elegant', 'minimalist', 'simple', 'pure', 'clean', 'clear', 'fresh air', 'deep breath', 'inner peace', 'mental clarity', 'spiritual', 'enlightened', 'awakened', 'conscious', 'aware', 'observant', 'contemplative', 'reflective', 'introspective'],
        hashtags: ['#peaceful', '#calm', '#relax', '#zen', '#meditation', '#nature', '#quiet', '#mindful', '#balance', '#harmony', '#breathe', '#serenity', '#tranquil', '#gentle', '#soothing', '#healing', '#centered', '#grounded', '#innerpeace', '#mentalclarity', '#spiritual', '#mindfulness', '#selfcare', '#wellness', '#slowliving', '#minimalist', '#simplicity', '#naturetherapy', '#forestbathing'],
        emojis: ['🧘', '🌿', '🍃', '🌱', '🌸', '🌺', '🦋', '☁️', '🌅', '🌄', '🏞️', '🕯️', '💆', '🤍', '🤲', '🙏', '🕊️', '🌊', '🏔️', '🌲', '🌳', '🍀', '🌾', '💧', '💎', '🔮', '🌙', '⭐', '☮️', '♻️'],
        weight: 0.8,
        color: '#10B981',
        icon: '🧘'
    },
    professional: {
        keywords: ['business', 'work', 'professional', 'corporate', 'meeting', 'office', 'career', 'job', 'entrepreneur', 'startup', 'company', 'team', 'project', 'client', 'strategy', 'leadership', 'executive', 'manager', 'director', 'CEO', 'founder', 'innovation', 'technology', 'digital', 'marketing', 'sales', 'revenue', 'profit', 'investment', 'finance', 'banking', 'consulting', 'networking', 'conference', 'presentation', 'pitch', 'proposal', 'contract', 'deal', 'partnership', 'collaboration', 'productivity', 'efficiency', 'performance', 'results', 'achievement', 'milestone', 'deadline', 'target', 'objective', 'KPI', 'ROI', 'growth', 'expansion', 'scale', 'enterprise', 'industry', 'market', 'customer', 'brand', 'reputation', 'expertise', 'skill', 'qualification', 'certification', 'training', 'development', 'advancement'],
        hashtags: ['#business', '#work', '#professional', '#corporate', '#career', '#entrepreneur', '#startup', '#leadership', '#team', '#strategy', '#meeting', '#innovation', '#technology', '#digital', '#marketing', '#sales', '#finance', '#networking', '#conference', '#presentation', '#productivity', '#performance', '#growth', '#success', '#achievement', '#expertise', '#skills', '#training', '#development', '#industry', '#market', '#brand', '#consulting', '#executive'],
        emojis: ['💼', '👔', '📊', '📈', '💻', '📱', '🏢', '👨‍💼', '👩‍💼', '💰', '📋', '✍️', '🤝', '📞', '💳', '🏆', '📝', '📄', '📑', '🗂️', '📁', '💡', '⚡', '🎯', '📅', '⏰', '📍', '🌐', '💎', '🔗'],
        weight: 0.7,
        color: '#6B7280',
        icon: '💼'
    },
    romantic: {
        keywords: ['love', 'romance', 'romantic', 'date', 'valentine', 'anniversary', 'relationship', 'couple', 'partner', 'soulmate', 'sweetheart', 'darling', 'honey', 'baby', 'beautiful', 'gorgeous', 'stunning', 'attractive', 'charming', 'elegant', 'kiss', 'hug', 'cuddle', 'embrace', 'intimate', 'passionate', 'devoted', 'committed', 'faithful', 'loyal', 'caring', 'loving', 'affectionate', 'tender', 'sweet', 'adorable', 'cute', 'precious', 'special', 'forever', 'eternity', 'always', 'together', 'unity', 'bond', 'connection', 'chemistry', 'attraction', 'desire', 'longing', 'missing you', 'thinking of you', 'dream', 'fantasy', 'fairy tale', 'prince', 'princess', 'wedding', 'marriage', 'engagement'],
        hashtags: ['#love', '#romance', '#romantic', '#couple', '#relationship', '#valentine', '#anniversary', '#date', '#together', '#forever', '#soulmate', '#beautiful', '#gorgeous', '#kiss', '#hug', '#sweet', '#adorable', '#precious', '#wedding', '#engagement', '#married', '#inlove', '#loveofmylife', '#truelove', '#perfectmatch', '#relationshipgoals', '#couplegoals', '#loveyou', '#missingyou'],
        emojis: ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💟', '💞', '💌', '💐', '🌹', '🌺', '🌸', '💍', '👰', '🤵', '💒', '🕊️', '🦢', '🎀', '💋', '😘', '🥰', '😍', '🤗', '👫', '👬', '👭', '💏', '💑'],
        weight: 1.0,
        color: '#EC4899',
        icon: '💕'
    },
    travel: {
        keywords: ['travel', 'vacation', 'holiday', 'trip', 'adventure', 'explore', 'journey', 'wanderlust', 'destination', 'beach', 'mountain', 'city', 'country', 'flight', 'hotel', 'backpack', 'passport', 'visa', 'culture', 'local', 'tourist', 'sightseeing', 'landmark', 'monument', 'museum', 'gallery', 'architecture', 'history', 'tradition', 'festival', 'market', 'street food', 'souvenir', 'memories', 'photos', 'sunset', 'sunrise', 'ocean', 'forest', 'desert', 'safari', 'cruise', 'road trip', 'camping', 'hiking', 'trekking', 'climbing', 'diving', 'snorkeling', 'skiing', 'snowboarding', 'paradise', 'tropical', 'exotic', 'remote', 'hidden gem', 'bucket list', 'off the beaten path', 'nomad', 'digital nomad', 'gap year', 'study abroad', 'exchange', 'backpacking'],
        hashtags: ['#travel', '#vacation', '#holiday', '#trip', '#adventure', '#explore', '#wanderlust', '#destination', '#beach', '#mountain', '#city', '#backpacking', '#roadtrip', '#safari', '#cruise', '#hiking', '#trekking', '#paradise', '#tropical', '#bucketlist', '#digitalnomad', '#gapyear', '#studyabroad', '#culture', '#history', '#sunset', '#sunrise', '#ocean', '#forest', '#camping', '#memories'],
        emojis: ['✈️', '🌍', '🗺️', '🎒', '📷', '🏖️', '🏔️', '🏝️', '🚗', '🚢', '🎡', '🗽', '🏛️', '🕌', '🛣️', '🚁', '🏕️', '⛺', '🥾', '🧗', '🏊', '🤿', '🎿', '🏂', '🌅', '🌄', '🌋', '🏞️', '🗻', '🏜️', '🦒', '🐘', '🦓', '🐪'],
        weight: 1.1,
        color: '#06B6D4',
        icon: '✈️'
    },
    food: {
        keywords: ['food', 'delicious', 'yummy', 'tasty', 'recipe', 'cooking', 'chef', 'restaurant', 'meal', 'lunch', 'dinner', 'breakfast', 'hungry', 'feast', 'flavor', 'cuisine', 'culinary', 'gourmet', 'appetizer', 'dessert', 'snack', 'street food', 'fine dining', 'comfort food', 'homemade', 'fresh', 'organic', 'healthy', 'nutritious', 'diet', 'vegan', 'vegetarian', 'gluten-free', 'keto', 'paleo', 'spicy', 'sweet', 'sour', 'bitter', 'umami', 'savory', 'crispy', 'creamy', 'juicy', 'tender', 'moist', 'aromatic', 'fragrant', 'mouthwatering', 'scrumptious', 'delectable', 'heavenly', 'divine', 'irresistible', 'craving', 'indulgent', 'guilty pleasure', 'comfort', 'satisfying', 'nourishing', 'energizing'],
        hashtags: ['#food', '#delicious', '#yummy', '#tasty', '#recipe', '#cooking', '#chef', '#restaurant', '#foodie', '#hungry', '#feast', '#cuisine', '#gourmet', '#homemade', '#healthy', '#organic', '#vegan', '#vegetarian', '#glutenfree', '#keto', '#paleo', '#spicy', '#sweet', '#comfortfood', '#streetfood', '#finedining', '#mouthwatering', '#foodporn', '#foodstagram', '#foodlover', '#foodblogger'],
        emojis: ['🍕', '🍔', '🍟', '🌮', '🍜', '🍣', '🥗', '🍰', '🧁', '🍷', '☕', '🥑', '🍓', '🥘', '🍝', '🥙', '🥪', '🌭', '🥓', '🍳', '🥞', '🧀', '🥖', '🥨', '🍞', '🥯', '🧄', '🧅', '🌶️', '🥕', '🥒', '🍅', '🍆', '🥔', '🌽'],
        weight: 0.9,
        color: '#F97316',
        icon: '🍕'
    },
    funny: {
        keywords: ['funny', 'hilarious', 'comedy', 'joke', 'humor', 'laugh', 'laughing', 'lol', 'lmao', 'rofl', 'haha', 'hehe', 'giggle', 'chuckle', 'smile', 'grin', 'amusing', 'entertaining', 'witty', 'clever', 'sarcastic', 'ironic', 'silly', 'goofy', 'ridiculous', 'absurd', 'bizarre', 'weird', 'strange', 'quirky', 'eccentric', 'playful', 'mischievous', 'prankster', 'joker', 'comedian', 'clown', 'meme', 'viral', 'trending', 'epic fail', 'blooper', 'oops', 'awkward', 'cringe', 'facepalm', 'drama', 'tea', 'shade', 'roast', 'burn', 'savage'],
        hashtags: ['#funny', '#hilarious', '#comedy', '#humor', '#laugh', '#lol', '#lmao', '#haha', '#meme', '#viral', '#trending', '#witty', '#sarcastic', '#silly', '#goofy', '#ridiculous', '#playful', '#mischievous', '#epicfail', '#blooper', '#awkward', '#cringe', '#facepalm', '#drama', '#tea', '#savage', '#roast', '#comedian', '#joke'],
        emojis: ['😂', '🤣', '😄', '😆', '😁', '😸', '😹', '🤪', '🤭', '😜', '😝', '🙃', '😏', '🤨', '🙄', '🤦', '🤷', '🤡', '🎭', '🤯', '😵‍💫', '🥴', '🫠', '🤓', '🤠', '😎', '🥸'],
        weight: 1.1,
        color: '#FBBF24',
        icon: '😂'
    },
    fitness: {
        keywords: ['fitness', 'workout', 'exercise', 'gym', 'training', 'cardio', 'strength', 'muscle', 'bodybuilding', 'powerlifting', 'crossfit', 'yoga', 'pilates', 'running', 'jogging', 'cycling', 'swimming', 'boxing', 'martial arts', 'dance', 'zumba', 'aerobics', 'hiit', 'tabata', 'crosstraining', 'functional', 'mobility', 'flexibility', 'stretching', 'recovery', 'rest day', 'protein', 'nutrition', 'diet', 'supplements', 'hydration', 'gains', 'bulk', 'cut', 'shred', 'lean', 'toned', 'ripped', 'swole', 'beast mode', 'no pain no gain', 'push yourself', 'train hard', 'never skip', 'consistency', 'dedication', 'transformation', 'progress', 'personal record', 'PR', 'one more rep', 'mind muscle connection'],
        hashtags: ['#fitness', '#workout', '#exercise', '#gym', '#training', '#cardio', '#strength', '#muscle', '#bodybuilding', '#powerlifting', '#crossfit', '#yoga', '#pilates', '#running', '#cycling', '#swimming', '#boxing', '#martialarts', '#hiit', '#gains', '#transformation', '#progress', '#beastmode', '#trainhard', '#neverskip', '#consistency', '#dedication', '#personalrecord', '#mindmuscle', '#nopainnogain'],
        emojis: ['💪', '🏋️', '🤸', '🏃', '🚴', '🏊', '🥊', '🥋', '🧘', '🤾', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🥅', '🎯', '🏆', '🥇', '🥈', '🥉', '🔥', '💦', '⏱️', '📊', '📈'],
        weight: 1.2,
        color: '#EF4444',
        icon: '💪'
    },
    fashion: {
        keywords: ['fashion', 'style', 'outfit', 'dress', 'clothing', 'apparel', 'designer', 'brand', 'luxury', 'trendy', 'chic', 'elegant', 'sophisticated', 'classy', 'glamorous', 'stylish', 'fashionable', 'modern', 'vintage', 'retro', 'classic', 'timeless', 'casual', 'formal', 'streetwear', 'high fashion', 'couture', 'runway', 'model', 'photoshoot', 'magazine', 'vogue', 'fashion week', 'collection', 'season', 'trend', 'color', 'pattern', 'texture', 'fabric', 'material', 'accessory', 'jewelry', 'shoes', 'handbag', 'makeup', 'beauty', 'skincare', 'hair', 'nail art', 'manicure', 'pedicure', 'spa', 'salon'],
        hashtags: ['#fashion', '#style', '#outfit', '#ootd', '#fashion', '#designer', '#luxury', '#trendy', '#chic', '#elegant', '#glamorous', '#stylish', '#vintage', '#streetwear', '#highfashion', '#couture', '#runway', '#model', '#fashionweek', '#trend', '#accessory', '#jewelry', '#shoes', '#handbag', '#makeup', '#beauty', '#skincare', '#hair', '#nailart', '#spa', '#salon'],
        emojis: ['👗', '👚', '👖', '👔', '👕', '👘', '👙', '👠', '👡', '👢', '👞', '👟', '👜', '👛', '🎒', '👑', '💍', '💎', '📿', '👄', '💄', '💅', '🌟', '✨', '💫', '👸', '🤳'],
        weight: 0.9,
        color: '#EC4899',
        icon: '👗'
    },
    creative: {
        keywords: ['creative', 'art', 'artist', 'painting', 'drawing', 'sketch', 'design', 'designer', 'graphic', 'illustration', 'photography', 'photographer', 'camera', 'lens', 'shot', 'frame', 'composition', 'lighting', 'color', 'palette', 'brush', 'canvas', 'sculpture', 'craft', 'handmade', 'diy', 'project', 'idea', 'inspiration', 'imagination', 'innovation', 'original', 'unique', 'artistic', 'aesthetic', 'beautiful', 'masterpiece', 'gallery', 'exhibition', 'museum', 'studio', 'workshop', 'class', 'tutorial', 'process', 'technique', 'skill', 'talent', 'gift', 'passion', 'expression', 'emotion', 'story', 'narrative', 'concept', 'abstract', 'realistic', 'surreal'],
        hashtags: ['#creative', '#art', '#artist', '#painting', '#drawing', '#design', '#graphic', '#photography', '#photographer', '#handmade', '#diy', '#inspiration', '#imagination', '#artistic', '#aesthetic', '#masterpiece', '#gallery', '#studio', '#workshop', '#process', '#technique', '#talent', '#passion', '#expression', '#abstract', '#realistic', '#surreal', '#artoftheday', '#instaart', '#artwork'],
        emojis: ['🎨', '🖌️', '🖍️', '✏️', '🖊️', '🖋️', '✒️', '📷', '📸', '🎭', '🎪', '🎬', '🎤', '🎧', '🎵', '🎶', '🎼', '🎹', '🥁', '🎸', '🎺', '🎻', '🎷', '🌈', '✨', '💫', '🔮'],
        weight: 1.0,
        color: '#8B5CF6',
        icon: '🎨'
    },
    gaming: {
        keywords: ['gaming', 'game', 'gamer', 'play', 'playing', 'player', 'video game', 'console', 'pc', 'mobile', 'online', 'multiplayer', 'single player', 'campaign', 'story mode', 'battle royale', 'fps', 'rpg', 'mmo', 'strategy', 'puzzle', 'adventure', 'action', 'racing', 'sports', 'simulation', 'indie', 'triple a', 'steam', 'playstation', 'xbox', 'nintendo', 'switch', 'controller', 'keyboard', 'mouse', 'headset', 'stream', 'streaming', 'twitch', 'youtube', 'esports', 'tournament', 'competitive', 'ranked', 'casual', 'noob', 'pro', 'skill', 'clutch', 'epic', 'legendary', 'achievement', 'trophy', 'badge', 'level up', 'xp', 'loot', 'rare', 'legendary'],
        hashtags: ['#gaming', '#gamer', '#videogame', '#console', '#pc', '#mobile', '#online', '#multiplayer', '#battleroyal', '#fps', '#rpg', '#mmo', '#steam', '#playstation', '#xbox', '#nintendo', '#switch', '#twitch', '#youtube', '#esports', '#tournament', '#competitive', '#clutch', '#epic', '#legendary', '#achievement', '#levelup', '#loot', '#rare', '#pro'],
        emojis: ['🎮', '🕹️', '🎯', '🏆', '🥇', '🎊', '⚡', '🔥', '💥', '🎲', '🃏', '♠️', '♥️', '♦️', '♣️', '🎪', '🎭', '🎬', '📱', '💻', '⌨️', '🖱️', '🎧', '📺', '🖥️'],
        weight: 0.9,
        color: '#06B6D4',
        icon: '🎮'
    },
    luxury: {
        keywords: ['luxury', 'luxurious', 'premium', 'exclusive', 'elite', 'high-end', 'expensive', 'rich', 'wealth', 'wealthy', 'millionaire', 'billionaire', 'success', 'successful', 'achievement', 'accomplishment', 'first class', 'vip', 'private', 'custom', 'bespoke', 'handcrafted', 'limited edition', 'rare', 'precious', 'valuable', 'priceless', 'investment', 'collection', 'collector', 'connoisseur', 'refined', 'sophisticated', 'elegant', 'classy', 'upscale', 'lavish', 'extravagant', 'opulent', 'grand', 'magnificent', 'splendid', 'exquisite', 'fine', 'quality', 'craftsmanship', 'artisan', 'heritage', 'tradition', 'prestige', 'status', 'symbol', 'lifestyle', 'indulgence', 'treat', 'spoiled', 'pampered'],
        hashtags: ['#luxury', '#luxurious', '#premium', '#exclusive', '#elite', '#highend', '#expensive', '#rich', '#wealth', '#millionaire', '#success', '#firstclass', '#vip', '#private', '#bespoke', '#limitededition', '#rare', '#precious', '#investment', '#collection', '#refined', '#sophisticated', '#elegant', '#upscale', '#lavish', '#extravagant', '#opulent', '#exquisite', '#quality', '#prestige', '#status', '#lifestyle'],
        emojis: ['💎', '💍', '👑', '🏆', '🥇', '💰', '💳', '🏅', '🎖️', '🏵️', '🌟', '⭐', '✨', '💫', '🔮', '🎭', '🍾', '🥂', '🍷', '🥃', '🚁', '🛥️', '🏎️', '✈️', '🏨', '🏖️', '🏝️'],
        weight: 0.8,
        color: '#FBBF24',
        icon: '💎'
    }
};

class VibeAnalyzer {
    static analyzeText(text) {
        if (!text || typeof text !== 'string') {
            return {
                primaryVibe: 'neutral',
                confidence: 0,
                vibes: [],
                details: { reason: 'No text provided' }
            };
        }

        const normalizedText = text.toLowerCase();
        const vibeScores = {};
        const detectedElements = {};

        // Analyze each vibe category
        Object.entries(vibeKeywords).forEach(([vibeName, vibeData]) => {
            let score = 0;
            const detected = {
                keywords: [],
                hashtags: [],
                emojis: []
            };

            // Check keywords
            vibeData.keywords.forEach(keyword => {
                const count = (normalizedText.match(new RegExp(`\\b${keyword}\\b`, 'g')) || []).length;
                if (count > 0) {
                    score += count * vibeData.weight;
                    detected.keywords.push({ word: keyword, count });
                }
            });

            // Check hashtags
            vibeData.hashtags.forEach(hashtag => {
                const count = (normalizedText.match(new RegExp(hashtag.toLowerCase(), 'g')) || []).length;
                if (count > 0) {
                    score += count * vibeData.weight * 1.2; // Hashtags have higher weight
                    detected.hashtags.push({ tag: hashtag, count });
                }
            });

            // Check emojis
            vibeData.emojis.forEach(emoji => {
                const count = (text.match(new RegExp(emoji, 'g')) || []).length;
                if (count > 0) {
                    score += count * vibeData.weight * 1.5; // Emojis have highest weight
                    detected.emojis.push({ emoji, count });
                }
            });

            if (score > 0) {
                vibeScores[vibeName] = score;
                detectedElements[vibeName] = detected;
            }
        });

        // Sort vibes by score
        const sortedVibes = Object.entries(vibeScores)
            .sort(([,a], [,b]) => b - a)
            .map(([name, score]) => ({
                name,
                score: parseFloat(score.toFixed(2)),
                confidence: Math.min(score * 10, 100), // Convert to percentage
                color: vibeKeywords[name].color,
                icon: vibeKeywords[name].icon,
                elements: detectedElements[name]
            }));

        const primaryVibe = sortedVibes.length > 0 ? sortedVibes[0] : null;

        return {
            primaryVibe: primaryVibe ? primaryVibe.name : 'neutral',
            confidence: primaryVibe ? Math.round(primaryVibe.confidence) : 0,
            vibes: sortedVibes,
            totalScore: Object.values(vibeScores).reduce((sum, score) => sum + score, 0),
            details: {
                textLength: text.length,
                wordsAnalyzed: normalizedText.split(/\s+/).length,
                vibesDetected: sortedVibes.length,
                elements: detectedElements
            }
        };
    }

    static getVibeColor(vibeName) {
        return vibeKeywords[vibeName]?.color || '#6B7280';
    }

    static getVibeIcon(vibeName) {
        return vibeKeywords[vibeName]?.icon || '😐';
    }

    static getVibeDescription(vibeName) {
        const descriptions = {
            positive: 'Happy, joyful, and uplifting content',
            motivational: 'Inspiring, goal-oriented, and empowering',
            emotional: 'Deep, reflective, and heartfelt',
            energetic: 'High-energy, fun, and exciting',
            calm: 'Peaceful, relaxing, and zen-like',
            professional: 'Business-focused and formal',
            travel: 'Adventure and exploration themed',
            food: 'Food and culinary focused',
            neutral: 'Balanced or unidentified mood'
        };
        return descriptions[vibeName] || descriptions.neutral;
    }

    static analyzePostBatch(posts) {
        if (!Array.isArray(posts) || posts.length === 0) {
            return {
                overallVibe: 'neutral',
                vibeDistribution: {},
                totalPosts: 0,
                analysis: []
            };
        }

        const analysis = posts.map(post => {
            const description = post.postDescription || post.description || '';
            const vibeResult = this.analyzeText(description);
            
            return {
                postId: post._id || post.postUrl,
                postUrl: post.postUrl,
                description: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
                vibe: vibeResult,
                thumbnail: post.postThumbnail
            };
        });

        // Calculate overall distribution
        const vibeDistribution = {};
        let totalVibeScore = 0;

        analysis.forEach(item => {
            const primaryVibe = item.vibe.primaryVibe;
            if (primaryVibe !== 'neutral' && item.vibe.confidence > 20) {
                vibeDistribution[primaryVibe] = (vibeDistribution[primaryVibe] || 0) + 1;
                totalVibeScore += item.vibe.totalScore;
            }
        });

        // Find most common vibe
        const overallVibe = Object.entries(vibeDistribution)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

        return {
            overallVibe,
            vibeDistribution,
            totalPosts: posts.length,
            postsWithVibe: Object.values(vibeDistribution).reduce((sum, count) => sum + count, 0),
            averageVibeScore: totalVibeScore / posts.length,
            analysis: analysis.filter(item => item.vibe.confidence > 20) // Only return confident predictions
        };
    }
}

module.exports = VibeAnalyzer;