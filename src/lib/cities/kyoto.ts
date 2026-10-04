import type { KidsBook, McTask, PlaceTemplate, ShelfBook, WriteTask } from "../types";

const at = {
  fushimi: [34.96752, 135.77971],
  kiyomizu: [34.9943, 135.78444],
  sannenzaka: [34.99648, 135.78132],
  pagoda: [34.99849, 135.77932],
  kodaiji: [35.0003, 135.7806],
  yasaka: [35.0036, 135.77826],
  maruyama: [35.00376, 135.78148],
  chionin: [35.00562, 135.78354],
  shirakawa: [35.00571, 135.77438],
  hanamikoji: [35.00252, 135.77479],
  heian: [35.01607, 135.7829],
  philosopher: [35.01537, 135.79477],
  ginkaku: [35.0269, 135.79837],
  aqueduct: [35.01059, 135.79363],
  kinkaku: [35.03953, 135.72954],
  ryoanji: [35.03346, 135.71809],
  nijo: [35.01401, 135.74854],
  bamboo: [35.01674, 135.67115],
  togetsu: [35.01287, 135.67776],
  sanjusangen: [34.98817, 135.77178],
  nishiki: [35.00502, 135.76557],
  gosho: [35.02526, 135.76234],
  toji: [34.98063, 135.74772],
  rokuhara: [34.99706, 135.77333],
  nishijin: [35.02889, 135.75146],
  muromachi: [35.00347, 135.75845],
  nakagawa: [35.09716, 135.66843],
  byodoin: [34.8895, 135.80745],
  ujiBridge: [34.8928, 135.806],
  genjiMuseum: [34.8941, 135.81017],
  rashomon: [34.97931, 135.74262],
  daigokuden: [35.01844, 135.7425],
  shimogamo: [35.03699, 135.77245],
} as const;

function mc(
  task: string,
  question: string,
  choices: [string, string, string],
  correctIndex: 0 | 1 | 2,
): McTask {
  return { task, question, choices, correctIndex };
}

function wr(task: string, question: string): WriteTask {
  return { task, question };
}

function pin(
  id: string,
  name: string,
  coord: readonly [number, number],
  practical: string,
  scene: string,
  history: string,
  reflection: string,
  young: [McTask, McTask],
  older: [WriteTask, WriteTask],
  uncertain = false,
): PlaceTemplate {
  return {
    id,
    name,
    lat: coord[0],
    lng: coord[1],
    practical,
    uncertain,
    scene,
    history,
    reflection,
    young,
    older,
  };
}

export const landmarks: PlaceTemplate[] = [
  pin(
    "fushimi",
    "Fushimi Inari",
    at.fushimi,
    "Free to walk in.",
    "You are at the mountain shrine of Inari. Vermilion gates climb the slope, and stone foxes sit along the path as the shrine's messengers.",
    "People give torii, so the gates keep multiplying up the hill. The foxes are not pets in a story. They belong to the shrine.",
    "What would you leave behind if a gate was your way of saying thank you?",
    [
      mc(
        "Find a vermilion torii. Take a photo so the red gate fills the frame.",
        "What color is the gate?",
        ["Vermilion red", "Blue", "Unpainted wood"],
        0,
      ),
      mc(
        "Find a stone fox. Photo the whole animal, ears included.",
        "The fox is mostly made of what?",
        ["Stone", "Cloth", "Leaves"],
        0,
      ),
    ],
    [
      wr(
        "Walk in until two gates overlap in your photo. Take that picture.",
        "Write what the tunnel of gates does to the path. Does it hide the sky, frame it, or something else?",
      ),
      wr(
        "Find a fox that is not the first one by the entrance. Photo it and anything left beside it.",
        "Write what people have left by the fox, or write that nothing was there.",
      ),
    ],
  ),
  pin(
    "kiyomizu",
    "Kiyomizu-dera",
    at.kiyomizu,
    "Tickets. The stage is inside the grounds.",
    "A wooden stage juts from the temple over the hillside. The city and the slope fall away under the pillars.",
    "The site is old, and the halls have been rebuilt after fires. The stage you see is the temple's famous balcony, not a copy invented for visitors.",
    "What changes when you look at a city from a floor that is really a cliff?",
    [
      mc(
        "Find the wooden stage that sticks out over the hill. Photo it from the side or from below. Stay behind the rails.",
        "What is the stage made of, the part you can see?",
        ["Wood", "Glass", "Brick"],
        0,
      ),
      mc(
        "From the stage, photo the view with a bit of roof or railing in the frame.",
        "What are you looking out over?",
        ["A wooded slope", "A flat market street", "The sea"],
        0,
      ),
    ],
    [
      wr(
        "Photo one pillar or joint under the stage, close enough to see the wood.",
        "Write how the stage stays up, in one sentence, from what you can see.",
      ),
      wr(
        "Photo the view and one thing in it that is not a roof.",
        "Write what is farthest away that you can still name.",
      ),
    ],
  ),
  pin(
    "sannenzaka",
    "Sannenzaka",
    at.sannenzaka,
    "Free to walk the lane.",
    "A stone lane steps down from Kiyomizu between wooden shopfronts. It is the ordinary way into the temple hill.",
    "The slope has been a temple approach for a long time. The shops are part of the street now. Read any dates on the buildings yourself.",
    "Which feels older here, the stones under your feet or the things for sale?",
    [
      mc(
        "Find the stepped stone lane. Photo the steps with shops on both sides.",
        "What is under your shoes?",
        ["Stone steps", "Sand", "A bridge"],
        0,
      ),
      mc(
        "Photo one wooden front along the lane.",
        "What is the front mostly made of?",
        ["Wood", "Glass bricks", "Metal sheets"],
        0,
      ),
    ],
    [
      wr(
        "Walk the lane slowly. Photo a detail a shop is not trying to sell, such as a gutter, a tile, or a worn step.",
        "Write what that detail tells you about people walking here every day.",
      ),
      wr(
        "Photo the lane looking uphill, with the steps leading the eye.",
        "Write whether the street feels wide or narrow, and why.",
      ),
    ],
  ),
  pin(
    "pagoda",
    "Yasaka Pagoda",
    at.pagoda,
    "Free to see from the lane. You do not need to go inside.",
    "A five-story pagoda stands over the lanes below Kiyomizu. It is the tower of Hokan-ji.",
    "You are looking at it from the street. The pagoda is a neighborhood landmark, visible between the roofs.",
    "A tower like this is a landmark because you can see it from streets that are not its own. Where else can you spot it?",
    [
      mc(
        "Find the pagoda between the roofs. Photo the whole tower if you can.",
        "How many stories of roof can you count?",
        ["Three", "Five", "Eight"],
        1,
      ),
      mc(
        "Photo the pagoda with some of the lane in front of it.",
        "Is the tower taller than the shops beside it?",
        ["Yes, much taller", "No, the shops are taller", "They are exactly the same"],
        0,
      ),
    ],
    [
      wr(
        "Stand where a roof or a wire partly crosses the tower. Photo that.",
        "Write what gets in the way of a clear view, and whether you mind it.",
      ),
      wr(
        "Photo only the top two roofs against the sky.",
        "Write what the top of the tower is doing: a spire, a finial, or something you can't name.",
      ),
    ],
  ),
  pin(
    "kodaiji",
    "Kodai-ji",
    at.kodaiji,
    "The garden inside has tickets. The gate and the lane are outside.",
    "A temple gate sits in the lanes east of Yasaka. Kodai-ji was founded in memory of Toyotomi Hideyoshi by his widow, Nene.",
    "You can see the gate without a ticket. I am not describing the garden rooms from here.",
    "Who is a building for: the person it remembers, or the person standing at the gate now?",
    [
      mc(
        "Find the temple gate from the lane. Photo the gate, not the souvenir shops.",
        "What are you photographing?",
        ["A temple gate", "A train", "A swimming pool"],
        0,
      ),
      mc(
        "Photo one pattern on the gate or the wall beside it.",
        "Is the pattern mostly wood, stone, or painted plaster?",
        ["Wood", "Stone", "Painted plaster"],
        0,
      ),
    ],
    [
      wr(
        "Photo the gate from across the lane so the street is in the frame.",
        "Write what kind of street this temple opens onto.",
      ),
      wr(
        "Find a part of the wall that is not the main door. Photo it.",
        "Write what you think that part is for, or say you are not sure.",
      ),
    ],
  ),
  pin(
    "yasaka",
    "Yasaka Shrine",
    at.yasaka,
    "Free to enter the shrine court.",
    "The shrine at the east end of Shijo is the heart of Gion. A great vermilion gate faces the city, and the court opens behind it.",
    "Yasaka is the shrine of the Gion Festival. The floats are built in the downtown neighborhoods and belong to this shrine's summer. I am not putting a year on a sign I have not read today.",
    "A shrine can be a place of prayer and the back door of a busy street. Which one are you in?",
    [
      mc(
        "Find the big red gate. Photo it so you can see the opening through it.",
        "What color is the main gate?",
        ["Vermilion red", "Unpainted wood", "Blue"],
        0,
      ),
      mc(
        "Inside the court, photo a lantern or a stone guardian.",
        "What did you put in the photo?",
        ["A lantern or a guardian figure", "Only the sky", "A plate of food"],
        0,
      ),
    ],
    [
      wr(
        "Stand so the gate frames the street outside. Photo that frame.",
        "Write what the city looks like through the gate, in one sentence.",
      ),
      wr(
        "Find something people have tied, hung, or left as an offering. Photo it without touching it.",
        "Write what you think they were asking for, or write that you can't tell.",
      ),
    ],
  ),
  pin(
    "maruyama",
    "Maruyama Park",
    at.maruyama,
    "Free to walk in.",
    "A city park sits under the eastern hill, known for its weeping cherry. On an ordinary day it is paths, stalls, and trees.",
    "This is one of Kyoto's famous blossom grounds. If the tree is not in flower, the park is still the place.",
    "What is a park for in the weeks when nobody came for the blossoms?",
    [
      mc(
        "Find a large tree and photo the whole trunk and some branches.",
        "Where are you?",
        ["In a park", "On a station platform", "Inside a shop"],
        0,
      ),
      mc(
        "Photo a path with trees on at least one side.",
        "What is the ground of the path mostly?",
        ["Paving or packed earth", "Ocean water", "Snow"],
        0,
      ),
    ],
    [
      wr(
        "Photo the park with both a tree and something built, such as a lamp or a stall.",
        "Write how the built thing and the tree share the same place.",
      ),
      wr(
        "Find the drooping branches of a cherry if they are there. If not, photo the largest tree. Either way, take the photo.",
        "Write whether the tree looks dressed for visitors or just like a tree.",
      ),
    ],
  ),
  pin(
    "chionin",
    "Chion-in gate",
    at.chionin,
    "Photo the great gate from the street. Inner halls may charge.",
    "The head temple of Pure Land Buddhism in Kyoto has one of the largest wooden gates in the city. The sanmon rises at the top of a long stair.",
    "You can see the gate without going through the ticketed halls. The stairs are part of the approach.",
    "Why build a gate this large if a door would do?",
    [
      mc(
        "Find the huge wooden gate at the top of the stairs. Photo it from partway up, or from the bottom if that is as far as you go.",
        "The gate is mostly made of what?",
        ["Wood", "Glass", "Plastic"],
        0,
      ),
      mc(
        "Photo the stairs leading to the gate.",
        "Do the stairs go up, down, or stay flat?",
        ["Up", "Down", "Flat"],
        0,
      ),
    ],
    [
      wr(
        "Photo the gate so a person or a step shows how big it is.",
        "Write how the gate compares with the person or the step.",
      ),
      wr(
        "Look at the carvings or the brackets under the roof. Photo one of them.",
        "Write what the carving seems to be, or say you are not sure.",
      ),
    ],
  ),
  pin(
    "heian",
    "Heian Shrine",
    at.heian,
    "The front court is free. The garden behind the hall charges.",
    "A huge vermilion shrine in a Chinese-style plan, built to honor the founding of Heian-kyo in 794. The buildings are from the end of the nineteenth century, a memorial rather than the original palace.",
    "The court in front, with its wide gravel and the great gate, is the part you can walk without a garden ticket.",
    "This shrine remembers a city that was founded here and then changed for a thousand years. What is it actually remembering?",
    [
      mc(
        "Find the great red gate or the wide red hall. Photo it across the gravel.",
        "What color is the shrine building?",
        ["Vermilion red", "Gold leaf", "Plain concrete"],
        0,
      ),
      mc(
        "Photo the open gravel court.",
        "The ground in the court is mostly what?",
        ["Pale gravel", "Grass", "Water"],
        0,
      ),
    ],
    [
      wr(
        "Photo the building so the empty court is most of the picture.",
        "Write what the empty space is doing. Is it grand, quiet, or both?",
      ),
      wr(
        "Find a corner that is not the main postcard view. Photo that.",
        "Write what a visitor would miss if they only stood in the center.",
      ),
    ],
  ),
  pin(
    "philosopher",
    "Philosopher's Path",
    at.philosopher,
    "Free to walk.",
    "A canal-side path runs from near Ginkaku-ji down toward Nanzen-ji. It is named for the philosopher Nishida Kitaro, who walked it.",
    "The pin is on that path, not inside a cafe. Cherries line parts of it in spring. On other days it is a neighborhood walk beside the water.",
    "Why does a path become famous because one person used it to think?",
    [
      mc(
        "Find the path beside the canal. Photo the water and the walkway together.",
        "What is next to the path?",
        ["A canal or stream", "A train track", "The sea"],
        0,
      ),
      mc(
        "Photo a tree or a bush along the path.",
        "Are you on a walking path?",
        ["Yes", "No, this is a shop interior", "No, this is a station"],
        0,
      ),
    ],
    [
      wr(
        "Walk two minutes along the canal. Photo the view behind you.",
        "Write what kind of neighborhood the path passes: houses, temples, shops, or a mix.",
      ),
      wr(
        "Photo a small thing the water does: a reflection, a leaf, a ripple.",
        "Write one sentence about the water, with no need to be poetic.",
      ),
    ],
  ),
  pin(
    "ginkaku",
    "Ginkaku-ji",
    at.ginkaku,
    "Tickets.",
    "The Silver Pavilion was a shogun's villa temple in the fifteenth century. It was never covered in silver. The building sits above a raked sand garden and a pond.",
    "Ashikaga Yoshimasa retreated here. The sand mound and the raked sea of sand are part of the garden you walk.",
    "Someone named it for a metal it never wore. What do you do with a name that promises something the building refused?",
    [
      mc(
        "Find the dark wooden pavilion by the garden. Photo the building.",
        "Is the pavilion covered in shiny silver?",
        ["No, it is dark wood", "Yes, it is mirror-silver", "It is bright blue"],
        0,
      ),
      mc(
        "Photo the raked sand.",
        "What covers the ground in that part of the garden?",
        ["Pale sand or gravel", "A swimming pool", "A lawn only"],
        0,
      ),
    ],
    [
      wr(
        "Photo the pavilion and its reflection or the sand in one frame.",
        "Write what the building is not, based on its nickname and what you see.",
      ),
      wr(
        "Photo the sand garden from the side so the pattern of the raking shows.",
        "Write what the pattern reminds you of, and say that it is your comparison.",
      ),
    ],
  ),
  pin(
    "aqueduct",
    "Nanzen-ji aqueduct",
    at.aqueduct,
    "Free to see the brick aqueduct. Temple halls nearby may charge.",
    "A brick aqueduct crosses the temple approach. It belongs to the Lake Biwa Canal, from the Meiji period, and it looks like a Roman arcade dropped into a Zen temple lane.",
    "The canal brought water from the lake to the city. This is the showy piece of that work, beside Nanzen-ji.",
    "When a new city's plumbing is beautiful, do you treat it as a temple or as a tool?",
    [
      mc(
        "Find the row of brick arches. Photo them so at least three arches show.",
        "What are the arches made of?",
        ["Brick", "Ice", "Glass"],
        0,
      ),
      mc(
        "Photo one arch with the path going through or under it.",
        "Can you walk under an arch?",
        ["Yes", "No, it is a solid wall", "No, it is a painting"],
        0,
      ),
    ],
    [
      wr(
        "Photo the aqueduct with a temple roof or a tree in the same frame.",
        "Write how the brick and the temple lane feel next to each other.",
      ),
      wr(
        "Look up at the top of the channel. Photo that line against the sky.",
        "Write what you think is traveling through the top, or say you are not sure.",
      ),
    ],
  ),
  pin(
    "kinkaku",
    "Kinkaku-ji",
    at.kinkaku,
    "Tickets. The pavilion is inside the grounds.",
    "A gold-leaf pavilion stands over a pond, with the woods behind it. This is the building people mean by the Golden Pavilion.",
    "The pavilion was burned in 1950 and rebuilt. The gold you see is the replacement. The pond and the stroll around it are how the temple asks you to look.",
    "Can a rebuilt beauty carry the same calm as the one that was lost, or only the story of the loss?",
    [
      mc(
        "Find the gold pavilion across the water. Photo it with some of the pond.",
        "What color is the pavilion?",
        ["Gold", "Vermilion red", "Plain white"],
        0,
      ),
      mc(
        "Photo the reflection if the water is still enough. If it is not, photo the pavilion and the near shore.",
        "Is there water in front of the building?",
        ["Yes", "No, it stands in a street", "No, it is indoors"],
        0,
      ),
    ],
    [
      wr(
        "Photo the pavilion so the trees or the sky share the frame.",
        "Write what the gold does to the trees around it.",
      ),
      wr(
        "Walk to a second view of the same building. Photo that one.",
        "Write what changed between the postcard view and this one.",
      ),
    ],
  ),
  pin(
    "ryoanji",
    "Ryoan-ji",
    at.ryoanji,
    "Tickets.",
    "A Zen temple garden of stones set in raked gravel, viewed from a wooden veranda. There is no water in the gravel sea.",
    "The dry garden is the famous part. Count the stones yourself if you want a number. I am not turning a count into a riddle you could get wrong from a bad pamphlet.",
    "What is a garden for when it refuses flowers?",
    [
      mc(
        "Find the rock garden. Photo the gravel and at least one stone.",
        "The garden floor is mostly what?",
        ["Raked gravel", "A pond", "A lawn"],
        0,
      ),
      mc(
        "Photo the wooden edge you look from, with the garden beyond it.",
        "Where are you standing?",
        ["On a wooden veranda", "In a train", "On a bridge over the sea"],
        0,
      ),
    ],
    [
      wr(
        "Photo three stones and the rake marks around them.",
        "Write how the stones seem to sit together: a group, islands, or just stones.",
      ),
      wr(
        "Photo a part of the gravel where the pattern changes.",
        "Write what the raking makes the gravel look like.",
      ),
    ],
  ),
  pin(
    "nijo",
    "Nijo Castle",
    at.nijo,
    "Tickets for the palace rooms. The outer walls and the gate are the arrival.",
    "A Tokugawa palace in the middle of the city, with moats, gates, and nightingale floors that chirp when you walk the corridors inside.",
    "It was begun in the early seventeenth century as the shogun's Kyoto residence. The outer defenses are what you see before any ticket.",
    "A floor that sings when you step on it was a warning system. What does it mean that people now want to hear it?",
    [
      mc(
        "Find the castle gate or the long outer wall. Photo it.",
        "What is in your photo?",
        ["A castle gate or wall", "A bamboo path", "A food stall only"],
        0,
      ),
      mc(
        "Photo a piece of the moat or the stone base if you can see it.",
        "Is there a heavy stone wall?",
        ["Yes", "No, it is a glass shop", "No, it is a park bench only"],
        0,
      ),
    ],
    [
      wr(
        "If you go inside, photo the corridor floor without blocking the way. If you stay outside, photo the gate's iron or wood hardware.",
        "Write what that surface is for: a warning, a door, or something else.",
      ),
      wr(
        "Photo the castle from far enough back to show it sits in a city, not in the countryside.",
        "Write what modern thing shares the frame with the wall.",
      ),
    ],
  ),
  pin(
    "bamboo",
    "Arashiyama bamboo",
    at.bamboo,
    "Free to walk the path.",
    "A path runs through a tall bamboo grove in Arashiyama, beside the way toward Nonomiya and the villas. The stalks close over the walk.",
    "It is a planted grove along a temple path, not a wild forest that has always stood like this. It is still a real place, and it is crowded when the day is fine.",
    "When a path is this famous, who is it for: the person in front of you, or the picture they are taking?",
    [
      mc(
        "Stand on the path and photo the bamboo going up on both sides.",
        "What is taller than you on both sides?",
        ["Bamboo", "Ocean waves", "Cars"],
        0,
      ),
      mc(
        "Photo the path itself, the ground people walk.",
        "Are you in a grove?",
        ["Yes", "No, this is a station", "No, this is a shop"],
        0,
      ),
    ],
    [
      wr(
        "Photo a single stalk close up, with the grove soft behind it.",
        "Write one detail of the stalk you would not see from a postcard of the whole path.",
      ),
      wr(
        "Wait until the path is as empty as it gets. Photo that version.",
        "Write whether the place feels different when fewer people are in the frame.",
      ),
    ],
  ),
  pin(
    "togetsu",
    "Togetsukyo",
    at.togetsu,
    "Free to walk onto the bridge.",
    "The bridge crosses the river at Arashiyama, with the hills behind it. The name means the moon-crossing bridge.",
    "The bridge has been rebuilt over the centuries. You are on the working bridge, with traffic and walkers, not a ruin.",
    "A bridge is a place and a way to leave a place. Which are you using it as?",
    [
      mc(
        "Walk onto the bridge. Photo the river and one side of the bridge.",
        "What are you standing on?",
        ["A bridge", "A temple stage", "A train"],
        0,
      ),
      mc(
        "Photo the hills beyond the river.",
        "What is beyond the water?",
        ["Hills or trees", "The open sea", "A castle of gold"],
        0,
      ),
    ],
    [
      wr(
        "Photo the bridge from the bank so the whole span shows, if you can do that safely.",
        "Write what crosses the bridge besides people.",
      ),
      wr(
        "Photo the water looking downstream or upstream.",
        "Write whether the river looks fast, slow, or almost still.",
      ),
    ],
  ),
  pin(
    "sanjusangen",
    "Sanjusangen-do",
    at.sanjusangen,
    "Tickets. The statues are inside.",
    "A very long wooden hall, founded by Taira no Kiyomori. Inside is a thousand and one figures of Kannon. The hall standing now is a later rebuilding of that temple.",
    "The name means thirty-three bays, the length of the building. The Taira leader who founded it is the same house the Tale of the Heike watches fall. This pin is the building, not a battle.",
    "A man wanted the capital to hold his prayer in wood. The prayer is still here and he is not. What lasted?",
    [
      mc(
        "Find the long, low hall. Photo it so you can tell it is long.",
        "What shape is the building?",
        ["A long hall", "A tall five-story tower", "A round tent"],
        0,
      ),
      mc(
        "Photo the front steps or the columns.",
        "Is the building mostly wood?",
        ["Yes", "No, it is a glass tower", "No, it is a stone bridge"],
        0,
      ),
    ],
    [
      wr(
        "If you go in, photo one figure without using flash if the temple asks you not to. If you stay outside, photo the length of the hall.",
        "Write what 'a thousand' feels like here, from what you actually saw.",
      ),
      wr(
        "Photo an end of the building so the length runs away from you.",
        "Write how far the hall seems to go.",
      ),
    ],
  ),
  pin(
    "nishiki",
    "Nishiki Market",
    at.nishiki,
    "Free to walk through. It is a working market.",
    "A covered market street of fish, pickles, and knives, a few blocks of stalls under a roof in downtown Kyoto.",
    "It is a grocery street that became famous, not a museum of food. People still shop it.",
    "What is the polite way to look at someone else's lunch before it is lunch?",
    [
      mc(
        "Walk in under the roof. Photo the market street, not a close-up of one dish unless the stall is fine with it.",
        "Where are you?",
        ["In a covered market", "In a bamboo grove", "On a bridge"],
        0,
      ),
      mc(
        "Photo a sign, a lantern, or the market roof.",
        "Is there a roof over the street?",
        ["Yes", "No, it is open sky only", "No, you are indoors in a train"],
        0,
      ),
    ],
    [
      wr(
        "Photo one stall from a step back, so the seller's space stays theirs.",
        "Write what is being sold, and whether people are buying it or photographing it.",
      ),
      wr(
        "Find a smell you can name. You don't photo a smell, so photo the thing that makes it.",
        "Write the smell in one sentence a person who is not here could understand.",
      ),
    ],
  ),
  pin(
    "gosho",
    "Kyoto Imperial Palace",
    at.gosho,
    "The grounds are free. Check the day's entry rules before you go.",
    "Wide gravel courts and long, low palace buildings inside a park. This is the palace of the emperors in Kyoto before the court moved to Tokyo.",
    "It is not the original Heian palace. That older compound stood farther west, and a marker remains there. These buildings are the later palace.",
    "A palace can be empty and still feel occupied. What is left when the court has gone?",
    [
      mc(
        "Find a long palace building or a formal gate inside the grounds. Photo it across the gravel.",
        "The open ground is mostly what?",
        ["Gravel", "A pond", "Market stalls"],
        0,
      ),
      mc(
        "Photo a gate, a wall, or a corridor.",
        "Does the place feel like a palace garden and court?",
        ["Yes", "No, it is a train station", "No, it is a bamboo path"],
        0,
      ),
    ],
    [
      wr(
        "Photo the most empty part of the court you are allowed to stand in.",
        "Write what the emptiness is for. Ceremony, walking, or something you can't tell?",
      ),
      wr(
        "Photo a detail of wood, tile, or gravel that is easy to walk past.",
        "Write why a palace would bother with that detail.",
      ),
    ],
  ),
  pin(
    "toji",
    "To-ji",
    at.toji,
    "You can see the five-story pagoda from outside. Inner areas may charge.",
    "The east temple of the old capital, with a five-story pagoda that is one of the tallest wooden towers in Japan. Kukai's temple stood on this side of Heian-kyo.",
    "To-ji means the eastern temple. The western partner is gone. The pagoda is the thing you can find from the streets around the station.",
    "A city plan once had an east temple and a west temple. One of them is missing. What does the survivor tell you?",
    [
      mc(
        "Find the five-story pagoda. Photo the whole tower.",
        "How many stories of roof do you count?",
        ["Three", "Five", "Ten"],
        1,
      ),
      mc(
        "Photo the pagoda with some sky around it.",
        "Is the tower taller than the trees beside it?",
        ["Yes", "No", "There is no tower"],
        0,
      ),
    ],
    [
      wr(
        "Photo the pagoda from a street, so the city is in the frame with it.",
        "Write what sits at the foot of the tower now: roads, gates, houses, or a mix.",
      ),
      wr(
        "Photo one roof corner against the sky.",
        "Write how the roofs step as they go up.",
      ),
    ],
  ),
];

function bookPlace(
  id: string,
  name: string,
  coord: readonly [number, number],
  practical: string,
  scene: string,
  history: string,
  reflection: string,
  uncertain = false,
): PlaceTemplate {
  return {
    id,
    name,
    lat: coord[0],
    lng: coord[1],
    practical,
    uncertain,
    scene,
    history,
    reflection,
  };
}

export const books: ShelfBook[] = [
  {
    id: "geisha",
    title: "Memoirs of a Geisha",
    author: "Arthur Golden",
    why: "The best-known novel set in Gion. The girl and her house are fiction. The district is real.",
    places: [
      bookPlace(
        "shirakawa",
        "Shirakawa, Gion",
        at.shirakawa,
        "Free to walk. This corner is a working neighborhood.",
        "In the novel, a girl is brought into the geisha life of Gion, and this canal street is the face of that world. Her house is made up. You will not find her door. A small shrine, Tatsumi Daimyojin, sits at this corner.",
        "Gion grew beside Yasaka Shrine as a district of teahouses. The Shirakawa canal is lined with real ochaya. None of them is the novel's address.",
        "What is the difference between a street that looks like a story and a story that borrowed a street?",
      ),
      bookPlace(
        "hanamikoji",
        "Hanamikoji",
        at.hanamikoji,
        "Free to walk. In the evening this is a working street. Leave doorways alone.",
        "This is the evening street of the novel's Gion, where a geisha is seen on her way to an appointment. The appointments happen behind doors. Treat every real doorway as someone else's.",
        "Hanamikoji is the main lane of Gion Kobu. Women who work here are not characters.",
        "What do we owe the people who live in a place we came to because of a book?",
      ),
      bookPlace(
        "yasaka-book",
        "Yasaka Shrine",
        at.yasaka,
        "Free to enter the shrine court.",
        "The novel's Gion sits against this shrine. The book does not stage one scene on a single gate that I can point to. The shrine is the landmark the lanes lead to.",
        "Yasaka is older than the novel by a long way, and the Gion Festival belongs to it. The festival is not a chapter you can watch on an ordinary afternoon.",
        "A neighborhood can be a workplace and a shrine court at once. Which one did the novel need, and which one is in front of you?",
      ),
    ],
  },
  {
    id: "genji",
    title: "The Tale of Genji",
    author: "Murasaki Shikibu",
    why: "The great Heian novel. Its last chapters are set in Uji, south of Kyoto, and this walk stays there.",
    places: [
      bookPlace(
        "uji-bridge",
        "Uji Bridge",
        at.ujiBridge,
        "Free to walk onto the bridge.",
        "In the last chapters the tale moves to Uji. People come and go across the river to villas on the water. Those houses are not standing. The river and the bridge are the real place.",
        "Uji Bridge has been rebuilt many times. The crossing is old. The timber under you is not a relic from the tale.",
        "What is left of a place when the houses are gone and the river is not?",
      ),
      bookPlace(
        "byodoin",
        "Byodo-in",
        at.byodoin,
        "Tickets for the hall.",
        "Nothing in the tale happens inside this hall under its own name. It stands in the same small city, from the same eleventh-century world, so people fold it into the story. Notice that, and then set it aside.",
        "The Phoenix Hall was built as a nobleman's temple villa. It is a temple. It is not one of the houses in the novel.",
        "When a beautiful building is older than a mistake people tell about it, which one should you trust?",
      ),
      bookPlace(
        "genji-museum",
        "The Tale of Genji Museum",
        at.genjiMuseum,
        "A small museum by the river. Check the hours.",
        "This museum is about the book. It is not a room from the book. Use it if you want the story retold beside the river, then go back to the bridge.",
        "Uji built a museum for the tale because the last chapters made the town part of the novel. I am not describing cases I have not stood in front of.",
        "What does a museum add once you have already stood on the bridge?",
      ),
    ],
  },
  {
    id: "rashomon",
    title: "Rashomon",
    author: "Ryunosuke Akutagawa",
    why: "A short story at the ruined southern gate of the old capital. The gate is gone. One marker is the whole walk.",
    places: [
      bookPlace(
        "rashomon",
        "Site of the Rashomon gate",
        at.rashomon,
        "A marker by the road. There is no gate to enter.",
        "The story opens on a ruined gate in the rain, with a servant, a corpse, and a thief. The gate is not here as a building. This ground is the site.",
        "Rashomon was the southern gate of Heian-kyo. It is long gone. A stone marker stands here. Read it yourself. The app is not copying it.",
        "The story needs the gate to be ruined. What is left to feel when the ruin has been tidied into a stone?",
      ),
    ],
  },
  {
    id: "kinkaku-book",
    title: "The Temple of the Golden Pavilion",
    author: "Yukio Mishima",
    why: "The novel of the monk who burned the real pavilion. The walk is this one temple, because that is where the book stays.",
    places: [
      bookPlace(
        "kinkaku-book",
        "Kinkaku-ji",
        at.kinkaku,
        "Tickets.",
        "A novice at this temple becomes obsessed with the gold building and, in the novel, destroys it. The building in front of you is not the one in that act. It is the reconstruction after the real fire the novel drew on.",
        "The pavilion was burned in 1950 and raised again. Mishima's novel follows the young man who set that fire, then leaves the court case for its own account of beauty and spite. The gold is the replacement.",
        "What is heavier here: the copy of a beautiful thing, or the story of why the first one is gone?",
      ),
    ],
  },
  {
    id: "heike",
    title: "The Tale of the Heike",
    author: "Unknown, from the medieval telling",
    why: "The war tale of the Taira. Two Kyoto places still carry that house. The last battle is not in this city.",
    places: [
      bookPlace(
        "sanjusangen-book",
        "Sanjusangen-do",
        at.sanjusangen,
        "Tickets.",
        "This is not a battle scene. It is the long hall founded by Taira no Kiyomori, the leader whose house the tale watches rise and fall. The wars happen elsewhere. This is the Kyoto building that still carries his founding.",
        "A thousand and one figures of Kannon fill the hall. The building you walk is a later rebuilding. The name means thirty-three bays.",
        "He wanted the capital to show his power and his prayer. The figures are still here. What lasted?",
      ),
      bookPlace(
        "rokuhara",
        "Rokuharamitsu-ji",
        at.rokuhara,
        "The temple is in the old Taira district. Check if the halls are open.",
        "The tale's Taira clan ruled from Rokuhara, this eastern district. The temple stands in that neighborhood. The clan palace is gone. I am not pointing at a door that was theirs.",
        "Rokuhara was the Taira base in Kyoto. The temple is older than their glory and it remained after they fell. Read the temple's own signs for anything more precise.",
        "A district can keep the name of a power that left. What else here is a name with the thing missing?",
      ),
    ],
  },
  {
    id: "old-capital",
    title: "The Old Capital",
    author: "Yasunari Kawabata",
    why: "A novel of Kyoto's weaving quarter, the Gion Festival, and a twin who lives among the cedars north of the city.",
    places: [
      bookPlace(
        "nishijin",
        "Nishijin",
        at.nishijin,
        "The textile center is a starting point. Workshops are behind ordinary fronts.",
        "The girl at the center of the novel grows up in a merchant house in the weaving quarter, among kimono cloth and old lattice fronts. The novel does not give you a house number. This is the quarter.",
        "Nishijin has been Kyoto's weaving district for a long time. Some workshops still work here. The twin in the novel lives far to the north, in the cedar country. That village is a separate pin and a long walk.",
        "What does a city keep of a craft when the shopfronts get quieter?",
      ),
      bookPlace(
        "muromachi",
        "Shijo Muromachi",
        at.muromachi,
        "A downtown crossing. Festival floats are built near here in July, not on an ordinary day.",
        "The Gion Festival fills the novel's summer. Floats are built, streets close, and the year turns on the parade. You may not be here in July. These downtown blocks are where that part of the book happens.",
        "The floats belong to neighborhood associations around Shijo and Muromachi, tied to Yasaka Shrine. I will not name one float as the float from the novel.",
        "A festival can be the real main character of a city. What is left of it on an ordinary afternoon?",
      ),
      bookPlace(
        "yasaka-kawabata",
        "Yasaka Shrine",
        at.yasaka,
        "Free to enter the shrine court.",
        "The festival in the novel belongs to this shrine. The summer chapters need the shrine even when the floats are stored away.",
        "Yasaka is the religious home of the Gion Festival. The rest of the year the court is simply a shrine at the end of Shijo.",
        "Does a festival place still count when the festival is not happening?",
      ),
      bookPlace(
        "nakagawa",
        "Kitayama cedars, Nakagawa",
        at.nakagawa,
        "Far north of the center. Check the route time. Delete this pin if you are staying in town.",
        "The girl's twin lives among the cedar country north of the city, where trees are grown for the polished logs Kyoto uses. The novel's mountain house is not a marked gate.",
        "Kitayama is known for cedar used in tea-house timber. Nakagawa is a real cedar village in that country. I am not sure the book names this exact settlement.",
        "The city in the book needs the mountain, and the mountain needs the city to buy its trees. Which one feels like the old capital?",
        true,
      ),
    ],
  },
  {
    id: "pillow",
    title: "The Pillow Book",
    author: "Sei Shonagon",
    why: "Court notes from Heian Kyoto: snow, letters, irritations, festivals. The rooms are gone. The ground of the palace is not.",
    places: [
      bookPlace(
        "daigokuden",
        "Site of the Daigokuden",
        at.daigokuden,
        "A marked ruin in the old palace compound. There is no hall to enter.",
        "Sei Shonagon's notes are the small pleasures and annoyances of the court. Those rooms stood in the great palace enclosure of Heian-kyo. This is that ground. Her apartment is not marked.",
        "The early palace compound stood in this area. What you see is a ruin and a marker, not the painted halls. The Imperial Palace elsewhere in the city is a later palace on a different site.",
        "The book is made of things too small to leave a ruin. What small thing in front of you would she have bothered to write down?",
      ),
      bookPlace(
        "gosho-pillow",
        "Kyoto Imperial Palace",
        at.gosho,
        "The grounds are free. Check the day's entry rules.",
        "These long halls are the later palace, not the one she wrote in. Walk them as the court city after her century, a place that kept an emperor in Kyoto until the court moved to Tokyo.",
        "The buildings and the gravel courts are real, and they are younger than the Pillow Book. The older palace site is the Daigokuden pin.",
        "Which is closer to her book: a later palace you can still walk, or a marker in a field?",
      ),
      bookPlace(
        "shimogamo",
        "Shimogamo Shrine",
        at.shimogamo,
        "Free to enter the shrine grove.",
        "The court she writes about lived by the Kamo shrines and their festivals. I am not pinning one of her lists to a particular stone. This shrine is the sacred ground that calendar turned on.",
        "Shimogamo stands where the Kamo and Takano rivers meet. The Aoi Festival still links it to the old court. I am not dating the festival's beginning.",
        "A festival that still happens may be more of her world than any rebuilt room. What would you need to see to believe that?",
      ),
    ],
  },
  {
    id: "makioka",
    title: "The Makioka Sisters",
    author: "Junichiro Tanizaki",
    why: "The sisters live in Osaka. The novel brings them to Kyoto to look at cherry blossoms. This walk is only that visit.",
    places: [
      bookPlace(
        "heian-makioka",
        "Heian Shrine",
        at.heian,
        "The front court is free. The garden charges.",
        "The novel's blossom visits are a family ritual in Kyoto. This shrine garden is one of the famous blossom places of that city. I am not sure their cloth was spread on this exact lawn.",
        "Heian Shrine's garden is a real cherry ground. Treat it as the right kind of place, and change the pin if you want a different blossom spot.",
        "A family can keep a city as a once-a-year room. What is that room for when the blossoms are gone?",
        true,
      ),
      bookPlace(
        "maruyama-makioka",
        "Maruyama Park",
        at.maruyama,
        "Free to walk in.",
        "Another blossom ground in the same spring city. The weeping cherry here is a real tree people come for. I will not pretend the novel names this tree.",
        "Maruyama Park is the public hill park under the eastern temples. In flower it is crowded. Out of flower it is still the park.",
        "If the tree is bare, is the visit from the book still available, or only the park?",
        true,
      ),
    ],
  },
];

export const kidsBooks: KidsBook[] = [
  {
    title: "Wabi Sabi",
    author: "Mark Reibstein",
    why: "A cat walks through Kyoto trying to learn what wabi-sabi means.",
  },
  {
    title: "The Tale of Genji",
    author: "Murasaki Shikibu",
    why: "The old novel of the capital. The boys' trail does not follow it.",
  },
  {
    title: "Memoirs of a Geisha",
    author: "Arthur Golden",
    why: "A novel set in Gion. Background only. The tasks do not come from it.",
  },
];

export const kyoto = {
  key: "kyoto",
  label: "Kyoto",
  center: { lat: 35.0116, lng: 135.7681 },
  books,
  landmarks,
  kidsBooks,
};
