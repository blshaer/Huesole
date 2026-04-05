import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db";
import HomeGradient from "../models/HomeGradient";

dotenv.config();

// Raw CSS gradients from grabient.com
// rawCss is stored verbatim so the renderer uses it directly instead of
// reconstructing from colors[] + type, which loses complex stop patterns.
const rawCssGradients = [
  {
    name: "Crimson Twilight",
    colors: ["#951c65", "#9f2563", "#ae3064", "#c13c69", "#d4476f", "#e25378", "#ea5f82", "#ea6a8d", "#e27497", "#d37da1", "#c184aa", "#ae89b0", "#9f8db4"],
    type: "conic" as const,
    angle: 315,
    rawCss: "conic-gradient(from 315deg, #951c65 0.000deg, #951c65 27.692deg, #9f2563 calc(27.692deg + 0.1deg), #9f2563 55.385deg, #ae3064 calc(55.385deg + 0.1deg), #ae3064 83.077deg, #c13c69 calc(83.077deg + 0.1deg), #c13c69 110.769deg, #d4476f calc(110.769deg + 0.1deg), #d4476f 138.462deg, #e25378 calc(138.462deg + 0.1deg), #e25378 166.154deg, #ea5f82 calc(166.154deg + 0.1deg), #ea5f82 193.846deg, #ea6a8d calc(193.846deg + 0.1deg), #ea6a8d 221.538deg, #e27497 calc(221.538deg + 0.1deg), #e27497 249.231deg, #d37da1 calc(249.231deg + 0.1deg), #d37da1 276.923deg, #c184aa calc(276.923deg + 0.1deg), #c184aa 304.615deg, #ae89b0 calc(304.615deg + 0.1deg), #ae89b0 332.308deg, #9f8db4 calc(332.308deg + 0.1deg) 360.000deg)",
  },
  {
    name: "Electric Spectrum",
    colors: ["#3a6ef4", "#7077fa", "#a863db", "#d73496", "#f7002e", "#ff0000"],
    type: "linear" as const,
    angle: 180,
    rawCss: "linear-gradient(180deg, #3a6ef4 0.000%, #7077fa 20.000%, #a863db 40.000%, #d73496 60.000%, #f7002e 80.000%, #ff0000 100.000%)",
  },
  {
    name: "Neon Shards",
    colors: ["#ff15f3", "#f113ff", "#c520ff", "#8c3aff", "#5563f4", "#2f99e0"],
    type: "linear" as const,
    angle: 45,
    rawCss: "linear-gradient(45deg, #ff15f3 0.000%, #ff15f3 16.667%, #f113ff calc(16.667% + 1px), #f113ff 33.333%, #c520ff calc(33.333% + 1px), #c520ff 50.000%, #8c3aff calc(50.000% + 1px), #8c3aff 66.667%, #5563f4 calc(66.667% + 1px), #5563f4 83.333%, #2f99e0 calc(83.333% + 1px) 100.000%)",
  },
  {
    name: "Pastel Wheel",
    colors: ["#ff86cf", "#ff97cf", "#ffaccb", "#ffc3c4", "#fed6ba", "#f2e5af", "#e6eca4", "#dcec9b", "#d5e396", "#d4d395", "#d7bf97", "#dea99e", "#e994a8", "#f583b3", "#ff79be"],
    type: "conic" as const,
    angle: 210,
    rawCss: "conic-gradient(from 210deg, #ff86cf 0.000deg, #ff86cf 24.000deg, #ff97cf calc(24.000deg + 0.1deg), #ff97cf 48.000deg, #ffaccb calc(48.000deg + 0.1deg), #ffaccb 72.000deg, #ffc3c4 calc(72.000deg + 0.1deg), #ffc3c4 96.000deg, #fed6ba calc(96.000deg + 0.1deg), #fed6ba 120.000deg, #f2e5af calc(120.000deg + 0.1deg), #f2e5af 144.000deg, #e6eca4 calc(144.000deg + 0.1deg), #e6eca4 168.000deg, #dcec9b calc(168.000deg + 0.1deg), #dcec9b 192.000deg, #d5e396 calc(192.000deg + 0.1deg), #d5e396 216.000deg, #d4d395 calc(216.000deg + 0.1deg), #d4d395 240.000deg, #d7bf97 calc(240.000deg + 0.1deg), #d7bf97 264.000deg, #dea99e calc(264.000deg + 0.1deg), #dea99e 288.000deg, #e994a8 calc(288.000deg + 0.1deg), #e994a8 312.000deg, #f583b3 calc(312.000deg + 0.1deg), #f583b3 336.000deg, #ff79be calc(336.000deg + 0.1deg) 360.000deg)",
  },
  {
    name: "Cosmic Dusk",
    colors: ["#e9a18c", "#df90bf", "#d27fe5", "#c26ffa", "#b161fd", "#9e54ee", "#8b49cd", "#7a409e", "#6c3963", "#613521"],
    type: "conic" as const,
    angle: 255,
    rawCss: "conic-gradient(from 255deg, #e9a18c 0.000deg, #e9a18c 36.000deg, #df90bf calc(36.000deg + 0.1deg), #df90bf 72.000deg, #d27fe5 calc(72.000deg + 0.1deg), #d27fe5 108.000deg, #c26ffa calc(108.000deg + 0.1deg), #c26ffa 144.000deg, #b161fd calc(144.000deg + 0.1deg), #b161fd 180.000deg, #9e54ee calc(180.000deg + 0.1deg), #9e54ee 216.000deg, #8b49cd calc(216.000deg + 0.1deg), #8b49cd 252.000deg, #7a409e calc(252.000deg + 0.1deg), #7a409e 288.000deg, #6c3963 calc(288.000deg + 0.1deg), #6c3963 324.000deg, #613521 calc(324.000deg + 0.1deg) 360.000deg)",
  },
  {
    name: "Tropical Sunset",
    colors: ["#ffdc00", "#ffd900", "#ffcc03", "#ffb268", "#ff8ea3", "#ff60b3"],
    type: "linear" as const,
    angle: 0,
    rawCss: "linear-gradient(0deg, #ffdc00 0.000%, #ffdc00 16.667%, #ffd900 calc(16.667% + 1px), #ffd900 33.333%, #ffcc03 calc(33.333% + 1px), #ffcc03 50.000%, #ffb268 calc(50.000% + 1px), #ffb268 66.667%, #ff8ea3 calc(66.667% + 1px), #ff8ea3 83.333%, #ff60b3 calc(83.333% + 1px) 100.000%)",
  },
  {
    name: "Rose Radiance",
    colors: ["#bc3036", "#dd2358", "#ef227a", "#e82c96", "#cc40a6", "#a95ea7"],
    type: "conic" as const,
    angle: 270,
    rawCss: "conic-gradient(from 270deg, #bc3036 0.000deg, #bc3036 60.000deg, #dd2358 calc(60.000deg + 0.1deg), #dd2358 120.000deg, #ef227a calc(120.000deg + 0.1deg), #ef227a 180.000deg, #e82c96 calc(180.000deg + 0.1deg), #e82c96 240.000deg, #cc40a6 calc(240.000deg + 0.1deg), #cc40a6 300.000deg, #a95ea7 calc(300.000deg + 0.1deg) 360.000deg)",
  },
  {
    name: "Carnival Crush",
    colors: ["#c464be", "#f0055b", "#ff8d1d", "#fa9605", "#d70912", "#9a5944", "#44b39b"],
    type: "linear" as const,
    angle: 45,
    rawCss: "linear-gradient(45deg, #c464be 0.000%, #c464be 14.286%, #f0055b calc(14.286% + 1px), #f0055b 28.571%, #ff8d1d calc(28.571% + 1px), #ff8d1d 42.857%, #fa9605 calc(42.857% + 1px), #fa9605 57.143%, #d70912 calc(57.143% + 1px), #d70912 71.429%, #9a5944 calc(71.429% + 1px), #9a5944 85.714%, #44b39b calc(85.714% + 1px) 100.000%)",
  },
  {
    name: "Crimson Veil",
    colors: ["#f30000", "#d30014", "#b20052", "#920092", "#7200d1"],
    type: "linear" as const,
    angle: 0,
    rawCss: "linear-gradient(0deg, #f30000 0.000%, #f30000 20.000%, #d30014 calc(20.000% + 1px), #d30014 40.000%, #b20052 calc(40.000% + 1px), #b20052 60.000%, #920092 calc(60.000% + 1px), #920092 80.000%, #7200d1 calc(80.000% + 1px) 100.000%)",
  },
];

const seedRawCssGradients = async () => {
  try {
    await connectDB();

    let inserted = 0;
    let skipped = 0;

    for (const g of rawCssGradients) {
      const exists = await HomeGradient.findOne({ name: g.name });
      if (exists) {
        // Update rawCss even if entry already exists
        await HomeGradient.updateOne({ name: g.name }, { $set: { rawCss: g.rawCss } });
        console.log(`Updated rawCss for: ${g.name}`);
        skipped++;
      } else {
        await HomeGradient.create(g);
        console.log(`Inserted: ${g.name}`);
        inserted++;
      }
    }

    console.log(`\nDone! Inserted: ${inserted}, Updated: ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedRawCssGradients();
