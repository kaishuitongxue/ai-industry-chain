const industryData = [
  {
    "id": "ai-chip-design",
    "name": "AI 芯片设计",
    "layer": "upstream",
    "layerName": "上游·基础层",
    "scarcity": 10,
    "value": 9.5,
    "barrier": 10,
    "composite": 9.8,
    "trend": "up",
    "trendDesc": "需求持续暴增",
    "summary": "GPU/ASIC/NPU等AI专用芯片设计，是整个AI产业的算力源头。英伟达占据绝对主导地位，国产替代加速推进。",
    "companies": [
      {
        "name": "NVIDIA 英伟达",
        "country": "🇺🇸",
        "ticker": "NVDA",
        "marketCap": 5200,
        "capLabel": "市值 ¥377,000亿",
        "note": "GPU霸主，H200/B300系列",
        "exchange": "纳斯达克"
      },
      {
        "name": "AMD",
        "country": "🇺🇸",
        "ticker": "AMD",
        "marketCap": 310,
        "capLabel": "市值 ¥22,000亿",
        "note": "MI300X 加速追赶",
        "exchange": "纳斯达克"
      },
      {
        "name": "华为海思",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "未上市",
        "note": "昇腾910B系列"
      },
      {
        "name": "寒武纪",
        "country": "🇨🇳",
        "ticker": "688256.SS",
        "marketCap": 28,
        "capLabel": "市值 ¥2,000亿",
        "note": "思元系列AI芯片",
        "exchange": "上交所"
      },
      {
        "name": "海光信息",
        "country": "🇨🇳",
        "ticker": "688041.SS",
        "marketCap": 42,
        "capLabel": "市值 ¥3,000亿",
        "note": "深算系列DCU",
        "exchange": "上交所"
      },
      {
        "name": "Google",
        "country": "🇺🇸",
        "ticker": "GOOGL",
        "marketCap": 2500,
        "capLabel": "市值 ¥181,000亿",
        "note": "TPU v5 自研芯片",
        "exchange": "纳斯达克"
      },
      {
        "name": "Amazon",
        "country": "🇺🇸",
        "ticker": "AMZN",
        "marketCap": 2500,
        "capLabel": "市值 ¥181,000亿",
        "note": "Trainium/Inferentia",
        "exchange": "纳斯达克"
      },
      {
        "name": "Microsoft",
        "country": "🇺🇸",
        "ticker": "MSFT",
        "marketCap": 3800,
        "capLabel": "市值 ¥276,000亿",
        "note": "Maia 100 AI加速器",
        "exchange": "纳斯达克"
      },
      {
        "name": "Intel Gaudi",
        "country": "🇺🇸",
        "ticker": "INTC",
        "marketCap": 155,
        "capLabel": "市值 ¥11,000亿",
        "note": "Gaudi 3 AI加速器",
        "exchange": "纳斯达克"
      },
      {
        "name": "Graphcore",
        "country": "🇬🇧",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥200亿",
        "note": "IPU智能处理器"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-06",
        "event": "NVIDIA B300 发布，性能提升 4 倍",
        "impact": 0.3
      },
      {
        "date": "2026-05",
        "event": "美国对华芯片出口管制升级",
        "impact": -0.2
      }
    ]
  },
  {
    "id": "chip-manufacturing",
    "name": "芯片制造/代工",
    "layer": "upstream",
    "layerName": "上游·基础层",
    "scarcity": 10,
    "value": 9.6,
    "barrier": 10,
    "composite": 9.9,
    "trend": "up",
    "trendDesc": "产能极度紧张",
    "summary": "先进制程芯片制造门槛极高，台积电垄断 3nm 以下制程。AI 芯片订单已排至 2027 年，产能缺口巨大。",
    "companies": [
      {
        "name": "台积电 TSMC",
        "country": "🇹🇼",
        "ticker": "TSM",
        "marketCap": 920,
        "capLabel": "市值 ¥67,000亿",
        "note": "3nm/2nm 全球领先",
        "exchange": "纽交所"
      },
      {
        "name": "三星电子",
        "country": "🇰🇷",
        "ticker": "005930.KS",
        "marketCap": 350,
        "capLabel": "市值 ¥25,000亿",
        "note": "GAA 3nm 追赶中",
        "exchange": "韩国证交所"
      },
      {
        "name": "Intel",
        "country": "🇺🇸",
        "ticker": "INTC",
        "marketCap": 155,
        "capLabel": "市值 ¥11,000亿",
        "note": "Intel 18A 制程",
        "exchange": "纳斯达克"
      },
      {
        "name": "中芯国际 SMIC",
        "country": "🇨🇳",
        "ticker": "0981.HK",
        "marketCap": 38,
        "capLabel": "市值 ¥2,760亿",
        "note": "N+2 先进工艺",
        "exchange": "港交所"
      },
      {
        "name": "ASML",
        "country": "🇳🇱",
        "ticker": "ASML",
        "marketCap": 420,
        "capLabel": "市值 ¥30,000亿",
        "note": "EUV 光刻机垄断",
        "exchange": "纳斯达克"
      },
      {
        "name": "格罗方德 GF",
        "country": "🇺🇸",
        "ticker": "GFS",
        "marketCap": 28,
        "capLabel": "市值 ¥2,000亿",
        "note": "成熟制程代工",
        "exchange": "纳斯达克"
      },
      {
        "name": "联电 UMC",
        "country": "🇹🇼",
        "ticker": "UMC",
        "marketCap": 20,
        "capLabel": "市值 ¥1,450亿",
        "note": "28nm+成熟制程",
        "exchange": "纽交所"
      },
      {
        "name": "华虹半导体",
        "country": "🇨🇳",
        "ticker": "688347.SS",
        "marketCap": 12,
        "capLabel": "市值 ¥870亿",
        "note": "特色工艺代工",
        "exchange": "上交所"
      },
      {
        "name": "东京电子 TEL",
        "country": "🇯🇵",
        "ticker": "8035.T",
        "marketCap": 85,
        "capLabel": "市值 ¥6,200亿",
        "note": "半导体设备巨头",
        "exchange": "东京证交所"
      },
      {
        "name": "应用材料 AMAT",
        "country": "🇺🇸",
        "ticker": "AMAT",
        "marketCap": 150,
        "capLabel": "市值 ¥11,000亿",
        "note": "沉积/刻蚀设备",
        "exchange": "纳斯达克"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-06",
        "event": "台积电 3nm 产能满载至 2027",
        "impact": 0.2
      },
      {
        "date": "2026-04",
        "event": "ASML High-NA EUV 交付加速",
        "impact": 0.1
      }
    ]
  },
  {
    "id": "computing-infra",
    "name": "算力基础设施",
    "layer": "upstream",
    "layerName": "上游·基础层",
    "scarcity": 9.1,
    "value": 9.1,
    "barrier": 7.5,
    "composite": 8.7,
    "trend": "up",
    "trendDesc": "建设加速中",
    "summary": "数据中心、云计算平台、算力调度网络。AI 训练对算力需求呈指数增长，全球数据中心投资 2026 年超 3000 亿美元。",
    "companies": [
      {
        "name": "AWS",
        "country": "🇺🇸",
        "ticker": "AMZN",
        "marketCap": 2500,
        "capLabel": "市值 ¥181,000亿",
        "note": "全球最大云服务商",
        "exchange": "纳斯达克"
      },
      {
        "name": "Microsoft Azure",
        "country": "🇺🇸",
        "ticker": "MSFT",
        "marketCap": 3800,
        "capLabel": "市值 ¥276,000亿",
        "note": "OpenAI 独家算力",
        "exchange": "纳斯达克"
      },
      {
        "name": "Google Cloud",
        "country": "🇺🇸",
        "ticker": "GOOGL",
        "marketCap": 2500,
        "capLabel": "市值 ¥181,000亿",
        "note": "TPU 云服务",
        "exchange": "纳斯达克"
      },
      {
        "name": "阿里云",
        "country": "🇨🇳",
        "ticker": "BABA",
        "marketCap": 320,
        "capLabel": "市值 ¥23,000亿",
        "note": "中国最大公有云",
        "exchange": "纽交所"
      },
      {
        "name": "华为云",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "未上市",
        "note": "昇腾AI云服务"
      },
      {
        "name": "Equinix",
        "country": "🇺🇸",
        "ticker": "EQIX",
        "marketCap": 88,
        "capLabel": "市值 ¥6,380亿",
        "note": "全球数据中心REIT",
        "exchange": "纽交所"
      },
      {
        "name": "Oracle Cloud",
        "country": "🇺🇸",
        "ticker": "ORCL",
        "marketCap": 380,
        "capLabel": "市值 ¥27,600亿",
        "note": "OCI AI 集群",
        "exchange": "纽交所"
      },
      {
        "name": "CoreWeave",
        "country": "🇺🇸",
        "ticker": "CRWV",
        "marketCap": 25,
        "capLabel": "市值 ¥1,800亿",
        "note": "GPU云专业服务商",
        "exchange": "纳斯达克"
      },
      {
        "name": "Digital Realty",
        "country": "🇺🇸",
        "ticker": "DLR",
        "marketCap": 55,
        "capLabel": "市值 ¥4,000亿",
        "note": "全球数据中心REIT",
        "exchange": "纽交所"
      },
      {
        "name": "浪潮信息",
        "country": "🇨🇳",
        "ticker": "000977.SZ",
        "marketCap": 10,
        "capLabel": "市值 ¥725亿",
        "note": "AI服务器龙头",
        "exchange": "深交所"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-05",
        "event": "微软/OpenAI 千亿美元数据中心计划",
        "impact": 0.4
      }
    ]
  },
  {
    "id": "data-labeling",
    "name": "数据标注与处理",
    "layer": "upstream",
    "layerName": "上游·基础层",
    "scarcity": 4.8,
    "value": 5.8,
    "barrier": 2.5,
    "composite": 4.6,
    "trend": "flat",
    "trendDesc": "自动化替代中",
    "summary": "为模型训练提供标注数据。随着 AI 自动化标注技术发展，人工标注价值下降，高质量专业标注仍有需求。",
    "companies": [
      {
        "name": "Scale AI",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥1,020亿",
        "note": "估值140亿美元"
      },
      {
        "name": "Appen",
        "country": "🇦🇺",
        "ticker": "APX.AX",
        "marketCap": 0.4,
        "capLabel": "市值 ¥30亿",
        "note": "全球数据服务商",
        "exchange": "澳交所"
      },
      {
        "name": "海天瑞声",
        "country": "🇨🇳",
        "ticker": "688787.SS",
        "marketCap": 1.5,
        "capLabel": "市值 ¥110亿",
        "note": "AI训练数据龙头",
        "exchange": "上交所"
      },
      {
        "name": "云测数据",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "未上市",
        "note": "企业级数据标注"
      },
      {
        "name": "Labelbox",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥90亿",
        "note": "数据标注平台"
      },
      {
        "name": "Snorkel AI",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥120亿",
        "note": "程序化数据标注"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-03",
        "event": "Scale AI 获 Meta/Amazon 追加投资",
        "impact": 0.2
      }
    ]
  },
  {
    "id": "synthetic-data",
    "name": "合成数据/训练数据平台",
    "layer": "upstream",
    "layerName": "上游·基础层",
    "scarcity": 7.6,
    "value": 7.8,
    "barrier": 6.5,
    "composite": 7.4,
    "trend": "up",
    "trendDesc": "快速崛起",
    "summary": "用 AI 生成高质量训练数据，解决真实数据稀缺、隐私合规等问题。合成数据在自动驾驶、医疗等领域应用广泛。",
    "companies": [
      {
        "name": "Datagen",
        "country": "🇮🇱",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥110亿",
        "note": "合成数据领导者"
      },
      {
        "name": "Gretel.ai",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥60亿",
        "note": "隐私保护合成数据"
      },
      {
        "name": "Mostly AI",
        "country": "🇦🇹",
        "ticker": null,
        "marketCap": null,
        "capLabel": "未上市",
        "note": "结构化合成数据"
      },
      {
        "name": "整数智能",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "未上市",
        "note": "合成数据新锐"
      },
      {
        "name": "NVIDIA Omniverse",
        "country": "🇺🇸",
        "ticker": "NVDA",
        "marketCap": 5200,
        "capLabel": "市值 ¥377,000亿",
        "note": "3D合成数据平台",
        "exchange": "纳斯达克"
      },
      {
        "name": "Hazy",
        "country": "🇬🇧",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥20亿",
        "note": "隐私安全合成数据"
      },
      {
        "name": "Parallel Domain",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥40亿",
        "note": "自动驾驶仿真数据"
      },
      {
        "name": "Sky Engine AI",
        "country": "🇬🇧",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥50亿",
        "note": "合成视觉数据"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-04",
        "event": "Gartner 预测 2027 年合成数据将超真实数据",
        "impact": 0.3
      }
    ]
  },
  {
    "id": "llm",
    "name": "大语言模型 (LLM)",
    "layer": "midstream",
    "layerName": "中游·技术层",
    "scarcity": 9.6,
    "value": 10,
    "barrier": 9.5,
    "composite": 9.7,
    "trend": "up",
    "trendDesc": "竞争白热化",
    "summary": "GPT、Claude、Gemini 等大语言模型是当前 AI 产业核心。头部模型训练成本超 10 亿美元，技术和资金壁垒极高。",
    "companies": [
      {
        "name": "OpenAI",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥36,000亿",
        "note": "GPT-5，估值5000亿+"
      },
      {
        "name": "Anthropic",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥14,000亿",
        "note": "Claude 4 系列"
      },
      {
        "name": "Google DeepMind",
        "country": "🇺🇸",
        "ticker": "GOOGL",
        "marketCap": 2500,
        "capLabel": "市值 ¥181,000亿",
        "note": "Gemini 3",
        "exchange": "纳斯达克"
      },
      {
        "name": "Meta",
        "country": "🇺🇸",
        "ticker": "META",
        "marketCap": 1800,
        "capLabel": "市值 ¥131,000亿",
        "note": "Llama 4 开源",
        "exchange": "纳斯达克"
      },
      {
        "name": "深度求索 DeepSeek",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥1,450亿",
        "note": "DeepSeek-V3/R1"
      },
      {
        "name": "智谱AI",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥1,090亿",
        "note": "GLM-5 系列"
      },
      {
        "name": "月之暗面 Moonshot",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥870亿",
        "note": "Kimi 长文本模型"
      },
      {
        "name": "百度",
        "country": "🇨🇳",
        "ticker": "BIDU",
        "marketCap": 35,
        "capLabel": "市值 ¥2,540亿",
        "note": "文心一言 5.0",
        "exchange": "纳斯达克"
      },
      {
        "name": "月之暗面",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥250亿",
        "note": "Kimi长文本助手"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-06",
        "event": "OpenAI 营收突破 300 亿美元",
        "impact": 0.3
      },
      {
        "date": "2026-05",
        "event": "DeepSeek 登顶全球开源模型榜",
        "impact": 0.2
      }
    ]
  },
  {
    "id": "multimodal",
    "name": "多模态模型",
    "layer": "midstream",
    "layerName": "中游·技术层",
    "scarcity": 8.7,
    "value": 9.3,
    "barrier": 9,
    "composite": 9,
    "trend": "up",
    "trendDesc": "技术突破期",
    "summary": "融合文本、图像、视频、音频的统一模型。Sora、Veo 等视频生成模型引爆市场，多模态能力成为模型标配。",
    "companies": [
      {
        "name": "OpenAI (Sora)",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥36,000亿",
        "note": "视频生成先驱"
      },
      {
        "name": "Google (Veo 3)",
        "country": "🇺🇸",
        "ticker": "GOOGL",
        "marketCap": 2500,
        "capLabel": "市值 ¥181,000亿",
        "note": "视频/音频多模态",
        "exchange": "纳斯达克"
      },
      {
        "name": "Runway",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥290亿",
        "note": "Gen-4 视频模型"
      },
      {
        "name": "Pika Labs",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥110亿",
        "note": "AI视频新锐"
      },
      {
        "name": "MiniMax",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥580亿",
        "note": "海螺AI多模态平台"
      },
      {
        "name": "生数科技",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥90亿",
        "note": "Vidu视频大模型"
      },
      {
        "name": "Adobe",
        "country": "🇺🇸",
        "ticker": "ADBE",
        "marketCap": 220,
        "capLabel": "市值 ¥16,000亿",
        "note": "Firefly AI创意套件",
        "exchange": "纳斯达克"
      },
      {
        "name": "商汤科技",
        "country": "🇨🇳",
        "ticker": "0020.HK",
        "marketCap": 12,
        "capLabel": "市值 ¥870亿",
        "note": "日日新大模型",
        "exchange": "港交所"
      },
      {
        "name": "Stability AI",
        "country": "🇬🇧",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥80亿",
        "note": "Stable Diffusion"
      },
      {
        "name": "字节跳动",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥20,000亿",
        "note": "豆包/即梦AI"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-06",
        "event": "Sora Pro 发布，支持 4K 长视频",
        "impact": 0.3
      }
    ]
  },
  {
    "id": "ai-framework",
    "name": "AI 开发框架与工具",
    "layer": "midstream",
    "layerName": "中游·技术层",
    "scarcity": 5.5,
    "value": 7,
    "barrier": 6,
    "composite": 6.2,
    "trend": "flat",
    "trendDesc": "格局稳定",
    "summary": "PyTorch、TensorFlow 等深度学习框架，以及 LangChain、LlamaIndex 等 LLM 应用框架。开源生态成熟，门槛持续降低。",
    "companies": [
      {
        "name": "Meta (PyTorch)",
        "country": "🇺🇸",
        "ticker": "META",
        "marketCap": 1800,
        "capLabel": "市值 ¥131,000亿",
        "note": "最主流DL框架",
        "exchange": "纳斯达克"
      },
      {
        "name": "Google (TensorFlow/JAX)",
        "country": "🇺🇸",
        "ticker": "GOOGL",
        "marketCap": 2500,
        "capLabel": "市值 ¥181,000亿",
        "note": "TPU生态",
        "exchange": "纳斯达克"
      },
      {
        "name": "LangChain",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥110亿",
        "note": "LLM应用框架"
      },
      {
        "name": "Hugging Face",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥360亿",
        "note": "模型社区+平台"
      },
      {
        "name": "Anyscale (Ray)",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥140亿",
        "note": "分布式AI框架"
      },
      {
        "name": "潞晨科技",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "未上市",
        "note": "Colossal-AI 分布式训练"
      },
      {
        "name": "Anthropic MCP",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "非上市",
        "note": "Model Context Protocol"
      },
      {
        "name": "Weights & Biases",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥100亿",
        "note": "ML实验追踪平台"
      },
      {
        "name": "Replicate",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥50亿",
        "note": "模型部署API平台"
      },
      {
        "name": "Gradio",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "被HuggingFace收购",
        "note": "ML演示框架"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-04",
        "event": "PyTorch 3.0 发布，性能大幅提升",
        "impact": 0.1
      }
    ]
  },
  {
    "id": "vector-db",
    "name": "向量数据库",
    "layer": "midstream",
    "layerName": "中游·技术层",
    "scarcity": 5,
    "value": 5.5,
    "barrier": 5,
    "composite": 5.2,
    "trend": "flat",
    "trendDesc": "趋于红海",
    "summary": "存储和检索向量嵌入的专用数据库，是 RAG 等技术的关键基础设施。赛道拥挤，差异化难度加大。",
    "companies": [
      {
        "name": "Pinecone",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥250亿",
        "note": "向量数据库先驱"
      },
      {
        "name": "Weaviate",
        "country": "🇳🇱",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥70亿",
        "note": "开源向量数据库"
      },
      {
        "name": "Milvus/Zilliz",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥180亿",
        "note": "全球最大开源向量DB"
      },
      {
        "name": "Qdrant",
        "country": "🇩🇪",
        "ticker": null,
        "marketCap": null,
        "capLabel": "未上市",
        "note": "Rust向量数据库"
      },
      {
        "name": "Chroma",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥40亿",
        "note": "轻量级向量DB"
      },
      {
        "name": "Zilliz",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥150亿",
        "note": "Milvus企业版"
      },
      {
        "name": "Elastic",
        "country": "🇺🇸",
        "ticker": "ESTC",
        "marketCap": 12,
        "capLabel": "市值 ¥870亿",
        "note": "ES向量检索",
        "exchange": "纽交所"
      },
      {
        "name": "DataStax",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥200亿",
        "note": "Astra向量DB"
      },
      {
        "name": "Redis",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥300亿",
        "note": "Redis向量搜索"
      },
      {
        "name": "Marqo",
        "country": "🇦🇺",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥30亿",
        "note": "端到端向量搜索"
      }
    ],
    "newsFactors": []
  },
  {
    "id": "mlops",
    "name": "MLOps/AI 运维平台",
    "layer": "midstream",
    "layerName": "中游·技术层",
    "scarcity": 6.8,
    "value": 7.3,
    "barrier": 6.5,
    "composite": 6.9,
    "trend": "up",
    "trendDesc": "企业需求增长",
    "summary": "模型训练、部署、监控、版本管理的全生命周期平台。企业 AI 化加速推动 MLOps 需求爆发。",
    "companies": [
      {
        "name": "Databricks",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥4,350亿",
        "note": "数据+AI一体化"
      },
      {
        "name": "Weights & Biases",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥140亿",
        "note": "ML实验管理"
      },
      {
        "name": "MLflow/Databricks",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥4,350亿",
        "note": "开源MLOps平台"
      },
      {
        "name": "第四范式",
        "country": "🇨🇳",
        "ticker": "6682.HK",
        "marketCap": 2.8,
        "capLabel": "市值 ¥200亿",
        "note": "企业级AI平台",
        "exchange": "港交所"
      },
      {
        "name": "ClearML",
        "country": "🇮🇱",
        "ticker": null,
        "marketCap": null,
        "capLabel": "未上市",
        "note": "开源MLOps"
      },
      {
        "name": "Dataiku",
        "country": "🇫🇷",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥300亿",
        "note": "企业AI平台"
      },
      {
        "name": "Anyscale",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥100亿",
        "note": "Ray分布式框架"
      },
      {
        "name": "Domino Data Lab",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥150亿",
        "note": "MLOps企业平台"
      },
      {
        "name": "BentoML",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥40亿",
        "note": "AI模型部署"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-05",
        "event": "Databricks 估值破 600 亿美元",
        "impact": 0.2
      }
    ]
  },
  {
    "id": "ai-agent",
    "name": "AI Agent 智能体",
    "layer": "downstream",
    "layerName": "下游·应用层",
    "scarcity": 9.2,
    "value": 9.6,
    "barrier": 6.5,
    "composite": 8.7,
    "trend": "up",
    "trendDesc": "爆发增长🔥",
    "summary": "具备自主规划、执行、反思能力的 AI 智能体。2026 年被称为 Agent 元年，企业级 Agent 融资额同比增长 320%。",
    "companies": [
      {
        "name": "Anthropic",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥14,000亿",
        "note": "Claude Code Agent标杆"
      },
      {
        "name": "OpenAI",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥36,000亿",
        "note": "Operator Agent平台"
      },
      {
        "name": "Cognition (Devin)",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥360亿",
        "note": "AI软件工程师"
      },
      {
        "name": "Cohere (North)",
        "country": "🇨🇦",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥720亿",
        "note": "企业Agent平台"
      },
      {
        "name": "实在智能",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "未上市",
        "note": "RPA+Agent"
      },
      {
        "name": "澜舟科技",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "未上市",
        "note": "企业Agent平台"
      },
      {
        "name": "Salesforce",
        "country": "🇺🇸",
        "ticker": "CRM",
        "marketCap": 280,
        "capLabel": "市值 ¥20,300亿",
        "note": "Agentforce平台",
        "exchange": "纽交所"
      },
      {
        "name": "ServiceNow",
        "country": "🇺🇸",
        "ticker": "NOW",
        "marketCap": 200,
        "capLabel": "市值 ¥14,500亿",
        "note": "Now Assist AI",
        "exchange": "纽交所"
      },
      {
        "name": "UiPath",
        "country": "🇺🇸",
        "ticker": "PATH",
        "marketCap": 10,
        "capLabel": "市值 ¥725亿",
        "note": "企业自动化Agent",
        "exchange": "纽交所"
      },
      {
        "name": "钉钉",
        "country": "🇨🇳",
        "ticker": "BABA",
        "marketCap": 320,
        "capLabel": "市值 ¥23,000亿",
        "note": "钉钉AI助手",
        "exchange": "纽交所"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-06",
        "event": "AI Agent 赛道年度融资超 500 亿美元",
        "impact": 0.5
      },
      {
        "date": "2026-05",
        "event": "Salesforce 全面集成 AI Agent",
        "impact": 0.3
      }
    ]
  },
  {
    "id": "ai-coding",
    "name": "AI 编程助手",
    "layer": "downstream",
    "layerName": "下游·应用层",
    "scarcity": 8.1,
    "value": 8.3,
    "barrier": 6,
    "composite": 7.6,
    "trend": "up",
    "trendDesc": "开发者标配",
    "summary": "AI 辅助代码生成、审查、重构。GitHub Copilot 年收入破 20 亿美元，编程范式正在被 AI 重塑。",
    "companies": [
      {
        "name": "GitHub Copilot",
        "country": "🇺🇸",
        "ticker": "MSFT",
        "marketCap": 3800,
        "capLabel": "市值 ¥276,000亿",
        "note": "市场领导者",
        "exchange": "纳斯达克"
      },
      {
        "name": "Cursor/Anysphere",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥720亿",
        "note": "AI-first IDE"
      },
      {
        "name": "Codex (OpenAI)",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥36,000亿",
        "note": "终端AI编程助手"
      },
      {
        "name": "Replit",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥360亿",
        "note": "云端AI开发环境"
      },
      {
        "name": "通义灵码",
        "country": "🇨🇳",
        "ticker": "BABA",
        "marketCap": 320,
        "capLabel": "市值 ¥23,000亿",
        "note": "阿里AI编程助手",
        "exchange": "纽交所"
      },
      {
        "name": "文心快码",
        "country": "🇨🇳",
        "ticker": "BIDU",
        "marketCap": 35,
        "capLabel": "市值 ¥2,540亿",
        "note": "百度AI编程助手",
        "exchange": "纳斯达克"
      },
      {
        "name": "Anysphere (Cursor)",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥200亿",
        "note": "AI原生IDE"
      },
      {
        "name": "Codeium",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥90亿",
        "note": "企业级AI编程"
      },
      {
        "name": "Tabnine",
        "country": "🇮🇱",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥70亿",
        "note": "AI代码补全"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-06",
        "event": "Cursor 估值突破 100 亿美元",
        "impact": 0.3
      }
    ]
  },
  {
    "id": "ai-healthcare",
    "name": "AI 医疗健康",
    "layer": "downstream",
    "layerName": "下游·应用层",
    "scarcity": 9.1,
    "value": 9.5,
    "barrier": 8.5,
    "composite": 9.1,
    "trend": "up",
    "trendDesc": "审批加速",
    "summary": "AI 辅助诊断、药物研发、医学影像分析。FDA/中国NMPA 加速审批 AI 医疗器械，AI 制药缩短研发周期 50%+。",
    "companies": [
      {
        "name": "Tempus AI",
        "country": "🇺🇸",
        "ticker": "TEM",
        "marketCap": 8,
        "capLabel": "市值 ¥580亿",
        "note": "AI精准医疗平台",
        "exchange": "纳斯达克"
      },
      {
        "name": "Recursion",
        "country": "🇺🇸",
        "ticker": "RXRX",
        "marketCap": 3.5,
        "capLabel": "市值 ¥250亿",
        "note": "AI制药先驱",
        "exchange": "纳斯达克"
      },
      {
        "name": "Isomorphic Labs",
        "country": "🇬🇧",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥220亿",
        "note": "DeepMind制药"
      },
      {
        "name": "推想科技",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥90亿",
        "note": "AI医学影像"
      },
      {
        "name": "晶泰科技",
        "country": "🇨🇳",
        "ticker": "2228.HK",
        "marketCap": 1.5,
        "capLabel": "市值 ¥110亿",
        "note": "AI药物研发",
        "exchange": "港交所"
      },
      {
        "name": "医渡科技",
        "country": "🇨🇳",
        "ticker": "2158.HK",
        "marketCap": 1.2,
        "capLabel": "市值 ¥90亿",
        "note": "医疗AI大数据",
        "exchange": "港交所"
      },
      {
        "name": "英矽智能",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥150亿",
        "note": "AI制药平台"
      },
      {
        "name": "Butterfly Network",
        "country": "🇺🇸",
        "ticker": "BFLY",
        "marketCap": 2,
        "capLabel": "市值 ¥145亿",
        "note": "AI便携超声",
        "exchange": "纽交所"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-05",
        "event": "FDA 批准首款 AI 独立诊断系统",
        "impact": 0.4
      }
    ]
  },
  {
    "id": "ai-finance",
    "name": "AI 金融科技",
    "layer": "downstream",
    "layerName": "下游·应用层",
    "scarcity": 6.5,
    "value": 8.5,
    "barrier": 7.5,
    "composite": 7.4,
    "trend": "flat",
    "trendDesc": "稳步渗透",
    "summary": "智能风控、量化交易、智能投顾、反欺诈。金融行业 AI 渗透率超 60%，合规与安全是核心壁垒。",
    "companies": [
      {
        "name": "Bloomberg GPT",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥5,800亿",
        "note": "金融大模型"
      },
      {
        "name": "蚂蚁集团",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥11,000亿",
        "note": "智能风控+财富管理"
      },
      {
        "name": "同花顺",
        "country": "🇨🇳",
        "ticker": "300033.SZ",
        "marketCap": 18,
        "capLabel": "市值 ¥1,300亿",
        "note": "AI金融信息服务",
        "exchange": "深交所"
      },
      {
        "name": "Kensho (S&P)",
        "country": "🇺🇸",
        "ticker": "SPGI",
        "marketCap": 155,
        "capLabel": "市值 ¥11,000亿",
        "note": "AI金融分析",
        "exchange": "纳斯达克"
      },
      {
        "name": "Upstart",
        "country": "🇺🇸",
        "ticker": "UPST",
        "marketCap": 4.5,
        "capLabel": "市值 ¥330亿",
        "note": "AI信贷决策",
        "exchange": "纳斯达克"
      },
      {
        "name": "Affirm",
        "country": "🇺🇸",
        "ticker": "AFRM",
        "marketCap": 18,
        "capLabel": "市值 ¥1,300亿",
        "note": "AI信贷评估",
        "exchange": "纳斯达克"
      },
      {
        "name": "东方财富",
        "country": "🇨🇳",
        "ticker": "300059.SZ",
        "marketCap": 42,
        "capLabel": "市值 ¥3,050亿",
        "note": "AI智能投研",
        "exchange": "深交所"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-06",
        "event": "中国 AI + 金融监管沙盒扩大试点",
        "impact": 0.1
      }
    ]
  },
  {
    "id": "ai-education",
    "name": "AI 教育",
    "layer": "downstream",
    "layerName": "下游·应用层",
    "scarcity": 5.8,
    "value": 7.3,
    "barrier": 4.5,
    "composite": 6,
    "trend": "up",
    "trendDesc": "个性化教学",
    "summary": "AI 个性化辅导、自适应学习、智能批改。Khan Academy 的 Khanmigo 和 Duolingo Max 引领 AI 教育应用。",
    "companies": [
      {
        "name": "Khan Academy",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "非营利组织",
        "note": "Khanmigo AI 助教"
      },
      {
        "name": "Duolingo",
        "country": "🇺🇸",
        "ticker": "DUOL",
        "marketCap": 15,
        "capLabel": "市值 ¥1,090亿",
        "note": "Duolingo Max",
        "exchange": "纳斯达克"
      },
      {
        "name": "好未来",
        "country": "🇨🇳",
        "ticker": "TAL",
        "marketCap": 5,
        "capLabel": "市值 ¥360亿",
        "note": "MathGPT 数学大模型",
        "exchange": "纳斯达克"
      },
      {
        "name": "作业帮",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥360亿",
        "note": "AI 解题与辅导"
      },
      {
        "name": "科大讯飞",
        "country": "🇨🇳",
        "ticker": "002230.SZ",
        "marketCap": 22,
        "capLabel": "市值 ¥1,600亿",
        "note": "AI 教育+语音",
        "exchange": "深交所"
      },
      {
        "name": "多邻国 Duolingo",
        "country": "🇺🇸",
        "ticker": "DUOL",
        "marketCap": 15,
        "capLabel": "市值 ¥1,090亿",
        "note": "AI语言学习",
        "exchange": "纳斯达克"
      },
      {
        "name": "Chegg",
        "country": "🇺🇸",
        "ticker": "CHGG",
        "marketCap": 3,
        "capLabel": "市值 ¥220亿",
        "note": "AI教育辅导",
        "exchange": "纽交所"
      },
      {
        "name": "猿辅导",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥500亿",
        "note": "AI自适应学习"
      },
      {
        "name": "Coursera",
        "country": "🇺🇸",
        "ticker": "COUR",
        "marketCap": 4,
        "capLabel": "市值 ¥290亿",
        "note": "AI课程平台",
        "exchange": "纽交所"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-04",
        "event": "中国 AI+教育政策支持力度加大",
        "impact": 0.2
      }
    ]
  },
  {
    "id": "ai-content",
    "name": "AI 内容生成 (AIGC)",
    "layer": "downstream",
    "layerName": "下游·应用层",
    "scarcity": 4.3,
    "value": 6.8,
    "barrier": 3.5,
    "composite": 5,
    "trend": "down",
    "trendDesc": "竞争激烈",
    "summary": "AI 生成文案、图片、视频、音乐。Midjourney、Canva AI 等工具使内容创作门槛大幅降低，赛道竞争白热化。",
    "companies": [
      {
        "name": "Midjourney",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥870亿",
        "note": "AI图像生成标杆"
      },
      {
        "name": "Canva",
        "country": "🇦🇺",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥2,900亿",
        "note": "AI设计平台"
      },
      {
        "name": "Adobe Firefly",
        "country": "🇺🇸",
        "ticker": "ADBE",
        "marketCap": 220,
        "capLabel": "市值 ¥16,000亿",
        "note": "创意AI套件",
        "exchange": "纳斯达克"
      },
      {
        "name": "字节跳动即梦",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥22,000亿",
        "note": "AI内容创作平台"
      },
      {
        "name": "美图",
        "country": "🇨🇳",
        "ticker": "1357.HK",
        "marketCap": 6,
        "capLabel": "市值 ¥440亿",
        "note": "AI影像/设计工具",
        "exchange": "港交所"
      },
      {
        "name": "LiblibAI",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥60亿",
        "note": "AI绘画社区"
      },
      {
        "name": "Jasper",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥100亿",
        "note": "营销内容AI"
      },
      {
        "name": "Suno",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥50亿",
        "note": "AI音乐生成"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-05",
        "event": "Midjourney V8 引发设计行业震动",
        "impact": 0.2
      }
    ]
  },
  {
    "id": "embodied-ai",
    "name": "具身智能/机器人",
    "layer": "downstream",
    "layerName": "下游·应用层",
    "scarcity": 10,
    "value": 10,
    "barrier": 9,
    "composite": 9.8,
    "trend": "up",
    "trendDesc": "新风口🔥",
    "summary": "结合 AI 大模型的实体机器人，具备感知、规划和执行能力。人形机器人被视为继手机和汽车后的下一个万亿级终端。",
    "companies": [
      {
        "name": "Tesla (Optimus)",
        "country": "🇺🇸",
        "ticker": "TSLA",
        "marketCap": 1200,
        "capLabel": "市值 ¥87,000亿",
        "note": "人形机器人标杆",
        "exchange": "纳斯达克"
      },
      {
        "name": "Figure AI",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥1,880亿",
        "note": "人形机器人新锐"
      },
      {
        "name": "Boston Dynamics",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥220亿",
        "note": "Atlas 人形机器人"
      },
      {
        "name": "宇树科技 Unitree",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥360亿",
        "note": "人形机器人H1/G1"
      },
      {
        "name": "优必选 UBTECH",
        "country": "🇨🇳",
        "ticker": "9880.HK",
        "marketCap": 6,
        "capLabel": "市值 ¥440亿",
        "note": "Walker 系列",
        "exchange": "港交所"
      },
      {
        "name": "达闼机器人",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥180亿",
        "note": "云端智能机器人"
      },
      {
        "name": "宇树科技",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥150亿",
        "note": "四足/人形机器人"
      },
      {
        "name": "傅利叶智能",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥80亿",
        "note": "通用人形机器人"
      },
      {
        "name": "Apptronik",
        "country": "🇺🇸",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥60亿",
        "note": "Apollo 人形机器人"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-06",
        "event": "特斯拉 Optimus 进入工厂实测",
        "impact": 0.5
      },
      {
        "date": "2026-05",
        "event": "Figure AI 获微软/OpenAI 追加投资",
        "impact": 0.4
      }
    ]
  },
  {
    "id": "autonomous-driving",
    "name": "自动驾驶",
    "layer": "downstream",
    "layerName": "下游·应用层",
    "scarcity": 8.9,
    "value": 9.6,
    "barrier": 9.5,
    "composite": 9.3,
    "trend": "up",
    "trendDesc": "L4加速落地",
    "summary": "从 L2+ 辅助驾驶到 L4 无人驾驶，端到端大模型重塑技术路线。Robotaxi 在中美多个城市开启商用运营。",
    "companies": [
      {
        "name": "Waymo (Alphabet)",
        "country": "🇺🇸",
        "ticker": "GOOGL",
        "marketCap": 2500,
        "capLabel": "市值 ¥181,000亿",
        "note": "Robotaxi 领导者",
        "exchange": "纳斯达克"
      },
      {
        "name": "Tesla FSD",
        "country": "🇺🇸",
        "ticker": "TSLA",
        "marketCap": 1200,
        "capLabel": "市值 ¥87,000亿",
        "note": "端到端视觉方案",
        "exchange": "纳斯达克"
      },
      {
        "name": "华为 ADS",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "未上市",
        "note": "高阶智驾方案"
      },
      {
        "name": "百度 Apollo",
        "country": "🇨🇳",
        "ticker": "BIDU",
        "marketCap": 35,
        "capLabel": "市值 ¥2,540亿",
        "note": "萝卜快跑Robotaxi",
        "exchange": "纳斯达克"
      },
      {
        "name": "小鹏汽车",
        "country": "🇨🇳",
        "ticker": "XPEV",
        "marketCap": 18,
        "capLabel": "市值 ¥1,300亿",
        "note": "XNGP 全场景智驾",
        "exchange": "纽交所"
      },
      {
        "name": "Mobileye",
        "country": "🇮🇱",
        "ticker": "MBLY",
        "marketCap": 15,
        "capLabel": "市值 ¥1,090亿",
        "note": "ADAS 芯片+方案",
        "exchange": "纳斯达克"
      },
      {
        "name": "Cruise (GM)",
        "country": "🇺🇸",
        "ticker": "GM",
        "marketCap": 45,
        "capLabel": "市值 ¥3,300亿",
        "note": "Robotaxi 美国前三",
        "exchange": "纽交所"
      },
      {
        "name": "Aurora",
        "country": "🇺🇸",
        "ticker": "AUR",
        "marketCap": 6,
        "capLabel": "市值 ¥435亿",
        "note": "自动驾驶卡车",
        "exchange": "纳斯达克"
      },
      {
        "name": "地平线",
        "country": "🇨🇳",
        "ticker": null,
        "marketCap": null,
        "capLabel": "估值 ¥600亿",
        "note": "征程系列智驾芯片"
      },
      {
        "name": "蔚来",
        "country": "🇨🇳",
        "ticker": "NIO",
        "marketCap": 12,
        "capLabel": "市值 ¥870亿",
        "note": "NAD 全栈智驾",
        "exchange": "纽交所"
      }
    ],
    "newsFactors": [
      {
        "date": "2026-06",
        "event": "Waymo 周订单突破 20 万单",
        "impact": 0.3
      },
      {
        "date": "2026-05",
        "event": "中国 Robotaxi 多地获准全无人运营",
        "impact": 0.3
      }
    ]
  }
];

industryData.forEach(item => {
  const ni = item.newsFactors.reduce((s, nf) => s + nf.impact, 0);
  item.scarcity = Math.min(10, Math.max(1, +(item.scarcity + ni * 0.5).toFixed(1)));
  item.value = Math.min(10, Math.max(1, +(item.value + ni * 0.3).toFixed(1)));
  item.composite = +(item.scarcity * 0.4 + item.value * 0.35 + item.barrier * 0.25).toFixed(1);
  item.composite = Math.min(10, Math.max(1, item.composite));
});

const stockSimData = {};

// 根据市值估算模拟基准股价
function getBasePrice(marketCapB) {
  if (marketCapB >= 3000) return 400 + Math.random() * 100;     // 超大市值 $400-500
  if (marketCapB >= 1000) return 250 + Math.random() * 150;    // 大市值 $250-400
  if (marketCapB >= 300) return 150 + Math.random() * 100;     // 中市值 $150-250
  if (marketCapB >= 50) return 60 + Math.random() * 90;        // 中市值 $60-150
  if (marketCapB >= 10) return 20 + Math.random() * 40;        // 小市值 $20-60
  return 5 + Math.random() * 25;                                // 微型市值 $5-30
}

// 为每个有 ticker 的公司生成 60 天 K 线模拟数据
function generateKLineData(ticker, marketCapB) {
  const basePrice = getBasePrice(marketCapB || 100);
  const volatility = marketCapB >= 1000 ? 0.015 : marketCapB >= 100 ? 0.025 : 0.04;
  const data = [];
  let price = basePrice;

  const now = new Date();
  for (let i = 60; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // 跳过周末
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const change = (Math.random() - 0.48) * volatility * price; // 略微偏多
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * price * 0.8;
    const low = Math.min(open, close) - Math.random() * volatility * price * 0.8;
    const volume = Math.floor(1000000 + Math.random() * 50000000);

    data.push({
      date: date.toISOString().slice(0, 10),
      open: +open.toFixed(2),
      close: +close.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      volume
    });

    price = close;
  }

  return data;
}

// 初始化所有股票模拟数据
(function initStockData() {
  const seen = new Set();
  industryData.forEach(item => {
    item.companies.forEach(c => {
      if (c.ticker && !seen.has(c.ticker)) {
        seen.add(c.ticker);
        stockSimData[c.ticker] = {
          kline: generateKLineData(c.ticker, c.marketCap),
          currentPrice: null, // 由最后一条 K 线决定
          change: null,
          changePercent: null
        };
        const kline = stockSimData[c.ticker].kline;
        if (kline.length >= 2) {
          const latest = kline[kline.length - 1];
          const prev = kline[kline.length - 2];
          stockSimData[c.ticker].currentPrice = latest.close;
          stockSimData[c.ticker].change = +(latest.close - prev.close).toFixed(2);
          stockSimData[c.ticker].changePercent = +((latest.close - prev.close) / prev.close * 100).toFixed(2);
        }
      }
    });
  });
})();


