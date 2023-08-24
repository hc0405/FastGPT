import { SystemInputEnum } from '../app';
import { TaskResponseKeyEnum } from '../chat';
import {
  FlowModuleTypeEnum,
  FlowInputItemTypeEnum,
  FlowOutputItemTypeEnum,
  SpecialInputKeyEnum,
  FlowValueTypeEnum
} from './index';
import type { AppItemType } from '@/types/app';
import type { FlowModuleTemplateType } from '@/types/flow';
import { chatModelList } from '@/store/static';
import {
  Input_Template_History,
  Input_Template_TFSwitch,
  Input_Template_UserChatInput
} from './inputTemplate';
import { ContextExtractEnum, HttpPropsEnum } from './flowField';

export const ChatModelSystemTip =
  '模型固定的引導詞，通過調整該內容，可以引導模型聊天方向。該內容會被固定在上下文的開頭。可使用變量，例如 {{language}}';
export const ChatModelLimitTip =
  '限定模型對話範圍，會被放置在本次提問前，擁有強引導和限定性。可使用變量，例如 {{language}}。引導例子:\n1. 知識庫是關於 Laf 的介紹，參考知識庫回答問題，與 "Laf" 無關內容，直接回覆: "我不知道"。\n2. 你僅回答關於 "xxx" 的問題，其他問題回覆: "xxxx"';
export const userGuideTip = '可以添加特殊的對話前後引導模塊，更好的讓用戶進行對話';
export const welcomeTextTip =
  '每次對話開始前，發送一個初始內容。支持標準 Markdown 語法，可使用的額外標記:\n[快捷按鍵]: 用戶點擊後可以直接發送該問題';

export const VariableModule: FlowModuleTemplateType = {
  logo: '/imgs/module/variable.png',
  name: '全局變量',
  intro: '可以在對話開始前，要求用戶填寫一些內容作為本輪對話的變量。該模塊位於開場引導之後。',
  description:
    '全局變量可以通過 {{變量key}} 的形式注入到其他模塊 string 類型的輸入中，例如：提示詞、限定詞等',
  flowType: FlowModuleTypeEnum.variable,
  inputs: [
    {
      key: SystemInputEnum.variables,
      type: FlowInputItemTypeEnum.systemInput,
      label: '變量輸入',
      value: []
    }
  ],
  outputs: []
};
export const UserGuideModule: FlowModuleTemplateType = {
  logo: '/imgs/module/userGuide.png',
  name: '用戶引導',
  intro: userGuideTip,
  flowType: FlowModuleTypeEnum.userGuide,
  inputs: [
    {
      key: SystemInputEnum.welcomeText,
      type: FlowInputItemTypeEnum.input,
      label: '開場白'
    }
  ],
  outputs: []
};
export const UserInputModule: FlowModuleTemplateType = {
  logo: '/imgs/module/userChatInput.png',
  name: '用戶問題(對話入口)',
  intro: '用戶輸入的內容。該模塊通常作為應用的入口，用戶在發送消息後會首先執行該模塊。',
  flowType: FlowModuleTypeEnum.questionInput,
  inputs: [
    {
      key: SystemInputEnum.userChatInput,
      type: FlowInputItemTypeEnum.systemInput,
      label: '用戶問題'
    }
  ],
  outputs: [
    {
      key: SystemInputEnum.userChatInput,
      label: '用戶問題',
      type: FlowOutputItemTypeEnum.source,
      valueType: FlowValueTypeEnum.string,
      targets: []
    }
  ]
};
export const HistoryModule: FlowModuleTemplateType = {
  logo: '/imgs/module/history.png',
  name: '聊天記錄',
  intro: '用戶輸入的內容。該模塊通常作為應用的入口，用戶在發送消息後會首先執行該模塊。',
  flowType: FlowModuleTypeEnum.historyNode,
  inputs: [
    {
      key: 'maxContext',
      type: FlowInputItemTypeEnum.numberInput,
      label: '最長記錄數',
      value: 6,
      min: 0,
      max: 50
    },
    {
      key: SystemInputEnum.history,
      type: FlowInputItemTypeEnum.hidden,
      label: '聊天記錄'
    }
  ],
  outputs: [
    {
      key: SystemInputEnum.history,
      label: '聊天記錄',
      valueType: FlowValueTypeEnum.chatHistory,
      type: FlowOutputItemTypeEnum.source,
      targets: []
    }
  ]
};
export const ChatModule: FlowModuleTemplateType = {

  logo: '/imgs/module/AI.png',
  name: 'AI 對話',
  intro: 'AI 大模型對話',
  flowType: FlowModuleTypeEnum.chatNode,
  showStatus: true,
  inputs: [
    {
      key: 'model',
      type: FlowInputItemTypeEnum.custom,
      label: '對話模型',
      value: chatModelList[0]?.model,
      list: chatModelList.map((item) => ({ label: item.name, value: item.model }))
    },
    {
      key: 'temperature',
      type: FlowInputItemTypeEnum.slider,
      label: '溫度',
      value: 0,
      min: 0,
      max: 10,
      step: 1,
      markList: [
        { label: '嚴謹', value: 0 },
        { label: '發散', value: 10 }
      ]
    },
    {
      key: 'maxToken',
      type: FlowInputItemTypeEnum.custom,
      label: '回覆上限',
      value: chatModelList[0] ? chatModelList[0].contextMaxToken / 2 : 2000,
      min: 100,
      max: chatModelList[0]?.contextMaxToken || 4000,
      step: 50,
      markList: [
        { label: '100', value: 100 },
        {
          label: `${chatModelList[0]?.contextMaxToken || 4000}`,
          value: chatModelList[0]?.contextMaxToken || 4000
        }
      ]
    },
    {
      key: 'systemPrompt',
      type: FlowInputItemTypeEnum.textarea,
      label: '系統提示詞',
      valueType: FlowValueTypeEnum.string,
      description: ChatModelSystemTip,
      placeholder: ChatModelSystemTip
    },
    {
      key: 'limitPrompt',
      type: FlowInputItemTypeEnum.textarea,
      valueType: FlowValueTypeEnum.string,
      label: '限定詞',
      description: ChatModelLimitTip,
      placeholder: ChatModelLimitTip
    },
    Input_Template_TFSwitch,
    {
      key: 'quoteQA',
      type: FlowInputItemTypeEnum.target,
      label: '引用內容',
      valueType: FlowValueTypeEnum.kbQuote
    },
    Input_Template_History,
    Input_Template_UserChatInput
  ],
  outputs: [
    {
      key: TaskResponseKeyEnum.answerText,
      label: '模型回覆',
      description: '將在 stream 回覆完畢後觸發',
      valueType: FlowValueTypeEnum.string,
      type: FlowOutputItemTypeEnum.source,
      targets: []
    },
    {
      key: 'finish',
      label: '回覆結束',
      description: 'AI 回覆完成後觸發',
      valueType: FlowValueTypeEnum.boolean,
      type: FlowOutputItemTypeEnum.source,
      targets: []
    }
  ]
};

export const KBSearchModule: FlowModuleTemplateType = {
  logo: '/imgs/module/db.png',
  name: '知識庫搜索',
  intro: '去知識庫中搜索對應的答案。可作為 AI 對話引用參考。',
  flowType: FlowModuleTypeEnum.kbSearchNode,
  showStatus: true,
  inputs: [
    {
      key: 'kbList',
      type: FlowInputItemTypeEnum.custom,
      label: '關聯的知識庫',
      value: [],
      list: []
    },
    {
      key: 'similarity',
      type: FlowInputItemTypeEnum.slider,
      label: '相似度',
      value: 0.8,
      min: 0,
      max: 1,
      step: 0.01,
      markList: [
        { label: '100', value: 100 },
        { label: '1', value: 1 }
      ]
    },
    {
      key: 'limit',
      type: FlowInputItemTypeEnum.slider,
      label: '單次搜索上限',
      description: '最多取 n 條記錄作為本次問題引用',
      value: 5,
      min: 1,
      max: 20,
      step: 1,
      markList: [
        { label: '1', value: 1 },
        { label: '20', value: 20 }
      ]
    },
    Input_Template_TFSwitch,
    Input_Template_UserChatInput
  ],
  outputs: [
    {
      key: 'isEmpty',
      label: '搜索結果為空',
      type: FlowOutputItemTypeEnum.source,
      valueType: FlowValueTypeEnum.boolean,
      targets: []
    },
    {
      key: 'unEmpty',
      label: '搜索結果不為空',
      type: FlowOutputItemTypeEnum.source,
      valueType: FlowValueTypeEnum.boolean,
      targets: []
    },
    {
      key: 'quoteQA',
      label: '引用內容',
      description:
        '始終返回數組，如果希望搜索結果為空時執行額外操作，需要用到上面的兩個輸入以及目標模塊的觸發器',
      type: FlowOutputItemTypeEnum.source,
      valueType: FlowValueTypeEnum.kbQuote,
      targets: []
    }
  ]
};

export const AnswerModule: FlowModuleTemplateType = {
  logo: '/imgs/module/reply.png',
  name: '指定回覆',
  intro: '該模塊可以直接回覆一段指定的內容。常用於引導、提示',
  description: '該模塊可以直接回覆一段指定的內容。常用於引導、提示',
  flowType: FlowModuleTypeEnum.answerNode,
  inputs: [
    Input_Template_TFSwitch,
    {
      key: SpecialInputKeyEnum.answerText,
      type: FlowInputItemTypeEnum.textarea,
      valueType: FlowValueTypeEnum.string,
      label: '回覆的內容',
      description:
        '可以使用 \\n 來實現換行。也可以通過外部模塊輸入實現回覆，外部模塊輸入時會覆蓋當前填寫的內容'
    }
  ],
  outputs: [
    {
      key: 'finish',
      label: '回覆結束',
      description: '回覆完成後觸發',
      valueType: FlowValueTypeEnum.boolean,
      type: FlowOutputItemTypeEnum.source,
      targets: []
    }
  ]
};
export const TFSwitchModule: FlowModuleTemplateType = {
  logo: '',
  name: 'TF開關',
  intro: '可以判斷輸入的內容為 True 或者 False，從而執行不同操作。',
  flowType: FlowModuleTypeEnum.tfSwitchNode,
  inputs: [
    {
      key: SystemInputEnum.switch,
      type: FlowInputItemTypeEnum.target,
      label: '輸入'
    }
  ],
  outputs: [
    {
      key: 'true',
      label: 'True',
      type: FlowOutputItemTypeEnum.source,
      targets: []
    },
    {
      key: 'false',
      label: 'False',
      type: FlowOutputItemTypeEnum.source,
      targets: []
    }
  ]
};
export const ClassifyQuestionModule: FlowModuleTemplateType = {
  logo: '/imgs/module/cq.png',
  name: '問題分類',
  intro: '可以判斷用戶問題屬於哪方面問題，從而執行不同的操作。',
  description:
    '根據用戶的歷史記錄和當前問題判斷該次提問的類型。可以添加多組問題類型，下面是一個模板例子：\n類型1: 打招呼\n類型2: 關於 laf 通用問題\n類型3: 關於 laf 代碼問題\n類型4: 其他問題',
  flowType: FlowModuleTypeEnum.classifyQuestion,
  showStatus: true,
  inputs: [
    {
      key: 'systemPrompt',
      type: FlowInputItemTypeEnum.textarea,
      valueType: FlowValueTypeEnum.string,
      label: '系統提示詞',
      description:
        '你可以添加一些特定內容的介紹，從而更好的識別用戶的問題類型。這個內容通常是給模型介紹一個它不知道的內容。',
      placeholder: '例如: \n1. Laf 是一個雲函數開發平台……\n2. Sealos 是一個集群操作系統'
    },
    Input_Template_History,
    Input_Template_UserChatInput,
    {
      key: SpecialInputKeyEnum.agents,
      type: FlowInputItemTypeEnum.custom,
      label: '',
      value: [
        {
          value: '打招呼',
          key: 'fasw'
        },
        {
          value: '關於 xxx 的問題',
          key: 'fqsw'
        },
        {
          value: '其他問題',
          key: 'fesw'
        }
      ]
    }
  ],
  outputs: [
    {
      key: 'fasw',
      label: '',
      type: FlowOutputItemTypeEnum.hidden,
      targets: []
    },
    {
      key: 'fqsw',
      label: '',
      type: FlowOutputItemTypeEnum.hidden,
      targets: []
    },
    {
      key: 'fesw',
      label: '',
      type: FlowOutputItemTypeEnum.hidden,
      targets: []
    }
  ]
};
export const ContextExtractModule: FlowModuleTemplateType = {
  logo: '/imgs/module/extract.png',
  name: '文本內容提取',
  intro: '從文本中提取出指定格式的數據',
  description: '可從文本中提取指定的數據，例如：sql語句、搜索關鍵詞、代碼等',
  flowType: FlowModuleTypeEnum.contentExtract,
  showStatus: true,
  inputs: [
    Input_Template_TFSwitch,
    {
      key: ContextExtractEnum.description,
      type: FlowInputItemTypeEnum.textarea,
      valueType: FlowValueTypeEnum.string,
      label: '提取要求描述',
      description: '寫一段提取要求，告訴 AI 需要提取哪些內容',
      required: true,
      placeholder: '例如: \n1. 你是一個實驗室預約助手。根據用戶問題，提取出姓名、實驗室號和預約時間'
    },
    Input_Template_History,
    {
      key: ContextExtractEnum.content,
      type: FlowInputItemTypeEnum.target,
      label: '需要提取的文本',
      required: true,
      valueType: FlowValueTypeEnum.string
    },
    {
      key: ContextExtractEnum.extractKeys,
      type: FlowInputItemTypeEnum.custom,
      label: '目標字段',
      description: "由 '描述' 和 'key' 組成一個目標字段，可提取多個目標字段",
      value: []
    }
  ],
  outputs: [
    {
      key: ContextExtractEnum.success,
      label: '字段完全提取',
      valueType: FlowValueTypeEnum.boolean,
      type: FlowOutputItemTypeEnum.source,
      targets: []
    },
    {
      key: ContextExtractEnum.failed,
      label: '提取字段缺失',
      valueType: FlowValueTypeEnum.boolean,
      type: FlowOutputItemTypeEnum.source,
      targets: []
    },
    {
      key: ContextExtractEnum.fields,
      label: '完整提取結果',
      description: '一個 JSON 字符串，例如：{"name:":"YY","Time":"2023/7/2 18:00"}',
      valueType: FlowValueTypeEnum.string,
      type: FlowOutputItemTypeEnum.source,
      targets: []
    }
  ]
};
export const HttpModule: FlowModuleTemplateType = {
  logo: '/imgs/module/http.png',
  name: 'HTTP模塊',
  intro: '可以發出一個 HTTP POST 請求，實現更為覆雜的操作（聯網搜索、數據庫查詢等）',
  description: '可以發出一個 HTTP POST 請求，實現更為覆雜的操作（聯網搜索、數據庫查詢等）',
  flowType: FlowModuleTypeEnum.httpRequest,
  showStatus: true,
  inputs: [
    {
      key: HttpPropsEnum.url,
      value: '',
      type: FlowInputItemTypeEnum.input,
      label: '請求地址',
      description: '請求目標地址',
      placeholder: 'https://api.fastgpt.run/getInventory',
      required: true
    },
    Input_Template_TFSwitch
  ],
  outputs: [
    {
      key: HttpPropsEnum.finish,
      label: '請求結束',
      valueType: FlowValueTypeEnum.boolean,
      type: FlowOutputItemTypeEnum.source,
      targets: []
    }
  ]
};
export const EmptyModule: FlowModuleTemplateType = {
  logo: '/imgs/module/cq.png',
  name: '該模塊已被移除',
  intro: '',
  description: '',
  flowType: FlowModuleTypeEnum.empty,
  inputs: [],
  outputs: []
};

export const ModuleTemplates = [
  {
    label: '輸入模塊',
    list: [UserInputModule, HistoryModule]
  },
  {
    label: '引導模塊',
    list: [UserGuideModule, VariableModule]
  },
  {
    label: '內容生成',
    list: [ChatModule, AnswerModule]
  },
  {
    label: '知識庫模塊',
    list: [KBSearchModule]
  },
  {
    label: 'Agent',
    list: [ClassifyQuestionModule, ContextExtractModule, HttpModule]
  }
];
export const ModuleTemplatesFlat = ModuleTemplates.map((templates) => templates.list)?.flat();

// template
export const appTemplates: (AppItemType & { avatar: string; intro: string })[] = [
  {
    id: 'simpleChat',
    avatar: '/imgs/module/AI.png',
    name: '簡單的對話',
    intro: '一個極其簡單的 AI 對話應用',
    modules: [
      {
        moduleId: 'userChatInput',
        name: '用戶問題(對話入口)',
        flowType: 'questionInput',
        position: {
          x: 464.32198615344566,
          y: 1602.2698463081606
        },
        inputs: [
          {
            key: 'userChatInput',
            type: 'systemInput',
            label: '用戶問題',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'userChatInput',
            label: '用戶問題',
            type: 'source',
            valueType: 'string',
            targets: [
              {
                moduleId: 'chatModule',
                key: 'userChatInput'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'history',
        name: '聊天記錄',
        flowType: 'historyNode',
        position: {
          x: 452.5466249541586,
          y: 1276.3930310334215
        },
        inputs: [
          {
            key: 'maxContext',
            type: 'numberInput',
            label: '最長記錄數',
            value: 6,
            min: 0,
            max: 50,
            connected: true
          },
          {
            key: 'history',
            type: 'hidden',
            label: '聊天記錄',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'history',
            label: '聊天記錄',
            valueType: 'chat_history',
            type: 'source',
            targets: [
              {
                moduleId: 'chatModule',
                key: 'history'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'chatModule',
        name: 'AI 對話',
        flowType: 'chatNode',
        showStatus: true,
        position: {
          x: 1150.8317145593148,
          y: 957.9676672880053
        },
        inputs: [
          {
            key: 'model',
            type: 'custom',
            label: '對話模型',
            value: 'gpt-3.5-turbo-16k',
            list: [],
            connected: true
          },
          {
            key: 'temperature',
            type: 'slider',
            label: '溫度',
            value: 0,
            min: 0,
            max: 10,
            step: 1,
            markList: [
              {
                label: '嚴謹',
                value: 0
              },
              {
                label: '發散',
                value: 10
              }
            ],
            connected: true
          },
          {
            key: 'maxToken',
            type: 'custom',
            label: '回覆上限',
            value: 8000,
            min: 100,
            max: 16000,
            step: 50,
            markList: [
              {
                label: '100',
                value: 100
              },
              {
                label: '16000',
                value: 16000
              }
            ],
            connected: true
          },
          {
            key: 'systemPrompt',
            type: 'textarea',
            label: '系統提示詞',
            valueType: 'string',
            description:
              '模型固定的引導詞，通過調整該內容，可以引導模型聊天方向。該內容會被固定在上下文的開頭。可使用變量，例如 {{language}}',
            placeholder:
              '模型固定的引導詞，通過調整該內容，可以引導模型聊天方向。該內容會被固定在上下文的開頭。可使用變量，例如 {{language}}',
            value: '',
            connected: true
          },
          {
            key: 'limitPrompt',
            type: 'textarea',
            valueType: 'string',
            label: '限定詞',
            description:
              '限定模型對話範圍，會被放置在本次提問前，擁有強引導和限定性。可使用變量，例如 {{language}}。引導例子:\n1. 知識庫是關於 Laf 的介紹，參考知識庫回答問題，與 "Laf" 無關內容，直接回覆: "我不知道"。\n2. 你僅回答關於 "xxx" 的問題，其他問題回覆: "xxxx"',
            placeholder:
              '限定模型對話範圍，會被放置在本次提問前，擁有強引導和限定性。可使用變量，例如 {{language}}。引導例子:\n1. 知識庫是關於 Laf 的介紹，參考知識庫回答問題，與 "Laf" 無關內容，直接回覆: "我不知道"。\n2. 你僅回答關於 "xxx" 的問題，其他問題回覆: "xxxx"',
            value: '',
            connected: true
          },
          {
            key: 'switch',
            type: 'target',
            label: '觸發器',
            valueType: 'any',
            connected: false
          },
          {
            key: 'quoteQA',
            type: 'target',
            label: '引用內容',
            valueType: 'kb_quote',
            connected: false
          },
          {
            key: 'history',
            type: 'target',
            label: '聊天記錄',
            valueType: 'chat_history',
            connected: true
          },
          {
            key: 'userChatInput',
            type: 'target',
            label: '用戶問題',
            required: true,
            valueType: 'string',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'answerText',
            label: '模型回覆',
            description: '直接響應，無需配置',
            type: 'hidden',
            targets: []
          },
          {
            key: 'finish',
            label: '回覆結束',
            description: 'AI 回覆完成後觸發',
            valueType: 'boolean',
            type: 'source',
            targets: []
          }
        ]
      }
    ]
  },
  {
    id: 'simpleKbChat',
    avatar: '/imgs/module/db.png',
    name: '知識庫 + 對話引導',
    intro: '每次提問時進行一次知識庫搜索，將搜索結果注入 LLM 模型進行參考回答',
    modules: [
      {
        moduleId: 'userGuide',
        name: '用戶引導',
        flowType: 'userGuide',
        position: {
          x: 454.98510354678695,
          y: 721.4016845336229
        },
        inputs: [
          {
            key: 'welcomeText',
            type: 'input',
            label: '開場白',
            value: '你好，我是 laf 助手，有什麽可以幫助你的麽？',
            connected: true
          }
        ],
        outputs: []
      },
      {
        moduleId: 'userChatInput',
        name: '用戶問題(對話入口)',
        flowType: 'questionInput',
        position: {
          x: 464.32198615344566,
          y: 1602.2698463081606
        },
        inputs: [
          {
            key: 'userChatInput',
            type: 'systemInput',
            label: '用戶問題',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'userChatInput',
            label: '用戶問題',
            type: 'source',
            valueType: 'string',
            targets: [
              {
                moduleId: 'chatModule',
                key: 'userChatInput'
              },
              {
                moduleId: 'kbSearch',
                key: 'userChatInput'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'history',
        name: '聊天記錄',
        flowType: 'historyNode',
        position: {
          x: 452.5466249541586,
          y: 1276.3930310334215
        },
        inputs: [
          {
            key: 'maxContext',
            type: 'numberInput',
            label: '最長記錄數',
            value: 6,
            min: 0,
            max: 50,
            connected: true
          },
          {
            key: 'history',
            type: 'hidden',
            label: '聊天記錄',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'history',
            label: '聊天記錄',
            valueType: 'chat_history',
            type: 'source',
            targets: [
              {
                moduleId: 'chatModule',
                key: 'history'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'kbSearch',
        name: '知識庫搜索',
        flowType: 'kbSearchNode',
        showStatus: true,
        position: {
          x: 956.0838440206068,
          y: 887.462827870246
        },
        inputs: [
          {
            key: 'kbList',
            type: 'custom',
            label: '關聯的知識庫',
            value: [],
            list: [],
            connected: true
          },
          {
            key: 'similarity',
            type: 'slider',
            label: '相似度',
            value: 0.8,
            min: 0,
            max: 1,
            step: 0.01,
            markList: [
              {
                label: '100',
                value: 100
              },
              {
                label: '1',
                value: 1
              }
            ],
            connected: true
          },
          {
            key: 'limit',
            type: 'slider',
            label: '單次搜索上限',
            description: '最多取 n 條記錄作為本次問題引用',
            value: 5,
            min: 1,
            max: 20,
            step: 1,
            markList: [
              {
                label: '1',
                value: 1
              },
              {
                label: '20',
                value: 20
              }
            ],
            connected: true
          },
          {
            key: 'switch',
            type: 'target',
            label: '觸發器',
            valueType: 'any',
            connected: false
          },
          {
            key: 'userChatInput',
            type: 'target',
            label: '用戶問題',
            required: true,
            valueType: 'string',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'isEmpty',
            label: '搜索結果為空',
            type: 'source',
            valueType: 'boolean',
            targets: [
              {
                moduleId: '2752oj',
                key: 'switch'
              }
            ]
          },
          {
            key: 'unEmpty',
            label: '搜索結果不為空',
            type: 'source',
            valueType: 'boolean',
            targets: [
              {
                moduleId: 'chatModule',
                key: 'switch'
              }
            ]
          },
          {
            key: 'quoteQA',
            label: '引用內容',
            description:
              '始終返回數組，如果希望搜索結果為空時執行額外操作，需要用到上面的兩個輸入以及目標模塊的觸發器',
            type: 'source',
            valueType: 'kb_quote',
            targets: [
              {
                moduleId: 'chatModule',
                key: 'quoteQA'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'chatModule',
        name: 'AI 對話',
        flowType: 'chatNode',
        showStatus: true,
        position: {
          x: 1546.0823206390796,
          y: 1008.9827344021824
        },
        inputs: [
          {
            key: 'model',
            type: 'custom',
            label: '對話模型',
            value: 'gpt-3.5-turbo-16k',
            list: [],
            connected: true
          },
          {
            key: 'temperature',
            type: 'slider',
            label: '溫度',
            value: 0,
            min: 0,
            max: 10,
            step: 1,
            markList: [
              {
                label: '嚴謹',
                value: 0
              },
              {
                label: '發散',
                value: 10
              }
            ],
            connected: true
          },
          {
            key: 'maxToken',
            type: 'custom',
            label: '回覆上限',
            value: 8000,
            min: 100,
            max: 16000,
            step: 50,
            markList: [
              {
                label: '100',
                value: 100
              },
              {
                label: '16000',
                value: 16000
              }
            ],
            connected: true
          },
          {
            key: 'systemPrompt',
            type: 'textarea',
            label: '系統提示詞',
            valueType: 'string',
            description:
              '模型固定的引導詞，通過調整該內容，可以引導模型聊天方向。該內容會被固定在上下文的開頭。可使用變量，例如 {{language}}',
            placeholder:
              '模型固定的引導詞，通過調整該內容，可以引導模型聊天方向。該內容會被固定在上下文的開頭。可使用變量，例如 {{language}}',
            value: '',
            connected: true
          },
          {
            key: 'limitPrompt',
            type: 'textarea',
            valueType: 'string',
            label: '限定詞',
            description:
              '限定模型對話範圍，會被放置在本次提問前，擁有強引導和限定性。可使用變量，例如 {{language}}。引導例子:\n1. 知識庫是關於 Laf 的介紹，參考知識庫回答問題，與 "Laf" 無關內容，直接回覆: "我不知道"。\n2. 你僅回答關於 "xxx" 的問題，其他問題回覆: "xxxx"',
            placeholder:
              '限定模型對話範圍，會被放置在本次提問前，擁有強引導和限定性。可使用變量，例如 {{language}}。引導例子:\n1. 知識庫是關於 Laf 的介紹，參考知識庫回答問題，與 "Laf" 無關內容，直接回覆: "我不知道"。\n2. 你僅回答關於 "xxx" 的問題，其他問題回覆: "xxxx"',
            value: '',
            connected: true
          },
          {
            key: 'switch',
            type: 'target',
            label: '觸發器',
            valueType: 'any',
            connected: true
          },
          {
            key: 'quoteQA',
            type: 'target',
            label: '引用內容',
            valueType: 'kb_quote',
            connected: true
          },
          {
            key: 'history',
            type: 'target',
            label: '聊天記錄',
            valueType: 'chat_history',
            connected: true
          },
          {
            key: 'userChatInput',
            type: 'target',
            label: '用戶問題',
            required: true,
            valueType: 'string',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'answerText',
            label: '模型回覆',
            description: '直接響應，無需配置',
            type: 'hidden',
            targets: []
          },
          {
            key: 'finish',
            label: '回覆結束',
            description: 'AI 回覆完成後觸發',
            valueType: 'boolean',
            type: 'source',
            targets: []
          }
        ]
      },
      {
        moduleId: '2752oj',
        name: '指定回覆',
        flowType: 'answerNode',
        position: {
          x: 1542.9271243684725,
          y: 702.7819618017722
        },
        inputs: [
          {
            key: 'switch',
            type: 'target',
            label: '觸發器',
            valueType: 'any',
            connected: true
          },
          {
            key: 'text',
            value: '搜索結果為空',
            type: 'textarea',
            valueType: 'string',
            label: '回覆的內容',
            description:
              '可以使用 \\n 來實現換行。也可以通過外部模塊輸入實現回覆，外部模塊輸入時會覆蓋當前填寫的內容',
            connected: true
          }
        ],
        outputs: []
      }
    ]
  },
  {
    id: 'chatGuide',
    avatar: '/imgs/module/userGuide.png',
    name: '對話引導 + 變量',
    intro: '可以在對話開始發送一段提示，或者讓用戶填寫一些內容，作為本次對話的變量',
    modules: [
      {
        moduleId: 'userGuide',
        name: '用戶引導',
        flowType: 'userGuide',
        position: {
          x: 447.98520778293346,
          y: 721.4016845336229
        },
        inputs: [
          {
            key: 'welcomeText',
            type: 'input',
            label: '開場白',
            value: '你好，我可以為你翻譯各種語言，請告訴我你需要翻譯成什麽語言？',
            connected: true
          }
        ],
        outputs: []
      },
      {
        moduleId: 'variable',
        name: '全局變量',
        flowType: 'variable',
        position: {
          x: 444.0369195277651,
          y: 1008.5185781784537
        },
        inputs: [
          {
            key: 'variables',
            type: 'systemInput',
            label: '變量輸入',
            value: [
              {
                id: '35c640eb-cf22-431f-bb57-3fc21643880e',
                key: 'language',
                label: '目標語言',
                type: 'input',
                required: true,
                maxLen: 50,
                enums: [
                  {
                    value: ''
                  }
                ]
              },
              {
                id: '2011ff08-91aa-4f60-ae69-f311ab4797b3',
                key: 'language2',
                label: '下拉框測試',
                type: 'select',
                required: false,
                maxLen: 50,
                enums: [
                  {
                    value: '英語'
                  },
                  {
                    value: '法語'
                  }
                ]
              }
            ],
            connected: true
          }
        ],
        outputs: []
      },
      {
        moduleId: 'userChatInput',
        name: '用戶問題(對話入口)',
        flowType: 'questionInput',
        position: {
          x: 464.32198615344566,
          y: 1602.2698463081606
        },
        inputs: [
          {
            key: 'userChatInput',
            type: 'systemInput',
            label: '用戶問題',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'userChatInput',
            label: '用戶問題',
            type: 'source',
            valueType: 'string',
            targets: [
              {
                moduleId: 'chatModule',
                key: 'userChatInput'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'history',
        name: '聊天記錄',
        flowType: 'historyNode',
        position: {
          x: 452.5466249541586,
          y: 1276.3930310334215
        },
        inputs: [
          {
            key: 'maxContext',
            type: 'numberInput',
            label: '最長記錄數',
            value: 10,
            min: 0,
            max: 50,
            connected: true
          },
          {
            key: 'history',
            type: 'hidden',
            label: '聊天記錄',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'history',
            label: '聊天記錄',
            valueType: 'chat_history',
            type: 'source',
            targets: [
              {
                moduleId: 'chatModule',
                key: 'history'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'chatModule',
        name: 'AI 對話',
        flowType: 'chatNode',
        showStatus: true,
        position: {
          x: 981.9682828103937,
          y: 890.014595014464
        },
        inputs: [
          {
            key: 'model',
            type: 'custom',
            label: '對話模型',
            value: 'gpt-3.5-turbo-16k',
            list: [],
            connected: true
          },
          {
            key: 'temperature',
            type: 'slider',
            label: '溫度',
            value: 0,
            min: 0,
            max: 10,
            step: 1,
            markList: [
              {
                label: '嚴謹',
                value: 0
              },
              {
                label: '發散',
                value: 10
              }
            ],
            connected: true
          },
          {
            key: 'maxToken',
            type: 'custom',
            label: '回覆上限',
            value: 8000,
            min: 100,
            max: 16000,
            step: 50,
            markList: [
              {
                label: '100',
                value: 100
              },
              {
                label: '16000',
                value: 16000
              }
            ],
            connected: true
          },
          {
            key: 'systemPrompt',
            type: 'textarea',
            label: '系統提示詞',
            valueType: 'string',
            description:
              '模型固定的引導詞，通過調整該內容，可以引導模型聊天方向。該內容會被固定在上下文的開頭。可使用變量，例如 {{language}}',
            placeholder:
              '模型固定的引導詞，通過調整該內容，可以引導模型聊天方向。該內容會被固定在上下文的開頭。可使用變量，例如 {{language}}',
            value: '',
            connected: true
          },
          {
            key: 'limitPrompt',
            type: 'textarea',
            valueType: 'string',
            label: '限定詞',
            description:
              '限定模型對話範圍，會被放置在本次提問前，擁有強引導和限定性。可使用變量，例如 {{language}}。引導例子:\n1. 知識庫是關於 Laf 的介紹，參考知識庫回答問題，與 "Laf" 無關內容，直接回覆: "我不知道"。\n2. 你僅回答關於 "xxx" 的問題，其他問題回覆: "xxxx"',
            placeholder:
              '限定模型對話範圍，會被放置在本次提問前，擁有強引導和限定性。可使用變量，例如 {{language}}。引導例子:\n1. 知識庫是關於 Laf 的介紹，參考知識庫回答問題，與 "Laf" 無關內容，直接回覆: "我不知道"。\n2. 你僅回答關於 "xxx" 的問題，其他問題回覆: "xxxx"',
            value: '將我的問題直接翻譯成英語{{language}}',
            connected: true
          },
          {
            key: 'switch',
            type: 'target',
            label: '觸發器',
            valueType: 'any',
            connected: false
          },
          {
            key: 'quoteQA',
            type: 'target',
            label: '引用內容',
            valueType: 'kb_quote',
            connected: false
          },
          {
            key: 'history',
            type: 'target',
            label: '聊天記錄',
            valueType: 'chat_history',
            connected: true
          },
          {
            key: 'userChatInput',
            type: 'target',
            label: '用戶問題',
            required: true,
            valueType: 'string',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'answerText',
            label: '模型回覆',
            description: '直接響應，無需配置',
            type: 'hidden',
            targets: []
          },
          {
            key: 'finish',
            label: '回覆結束',
            description: 'AI 回覆完成後觸發',
            valueType: 'boolean',
            type: 'source',
            targets: []
          }
        ]
      }
    ]
  },
  {
    id: 'CQ',
    avatar: '/imgs/module/cq.png',
    name: '問題分類 + 知識庫',
    intro: '先對用戶的問題進行分類，再根據不同類型問題，執行不同的操作',
    modules: [
      {
        moduleId: '7z5g5h',
        name: '用戶問題(對話入口)',
        flowType: 'questionInput',
        position: {
          x: 198.56612928723575,
          y: 1622.7034463081607
        },
        inputs: [
          {
            key: 'userChatInput',
            type: 'systemInput',
            label: '用戶問題',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'userChatInput',
            label: '用戶問題',
            type: 'source',
            valueType: 'string',
            targets: [
              {
                moduleId: 'remuj3',
                key: 'userChatInput'
              },
              {
                moduleId: 'nlfwkc',
                key: 'userChatInput'
              },
              {
                moduleId: 'fljhzy',
                key: 'userChatInput'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'xj0c9p',
        name: '聊天記錄',
        flowType: 'historyNode',
        position: {
          x: 194.99102398958047,
          y: 1801.3545999721096
        },
        inputs: [
          {
            key: 'maxContext',
            type: 'numberInput',
            label: '最長記錄數',
            value: 6,
            min: 0,
            max: 50,
            connected: true
          },
          {
            key: 'history',
            type: 'hidden',
            label: '聊天記錄',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'history',
            label: '聊天記錄',
            valueType: 'chat_history',
            type: 'source',
            targets: [
              {
                moduleId: 'nlfwkc',
                key: 'history'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'remuj3',
        name: '問題分類',
        flowType: 'classifyQuestion',
        showStatus: true,
        position: {
          x: 672.9092284362648,
          y: 1077.557793775116
        },
        inputs: [
          {
            key: 'systemPrompt',
            type: 'textarea',
            valueType: 'string',
            label: '系統提示詞',
            description:
              '你可以添加一些特定內容的介紹，從而更好的識別用戶的問題類型。這個內容通常是給模型介紹一個它不知道的內容。',
            placeholder: '例如: \n1. Laf 是一個雲函數開發平台……\n2. Sealos 是一個集群操作系統',
            value:
              'laf 是雲開發平台，可以快速的開發應用\nlaf 是一個開源的 BaaS 開發平台（Backend as a Service)\nlaf 是一個開箱即用的 serverless 開發平台\nlaf 是一個集「函數計算」、「數據庫」、「對象存儲」等於一身的一站式開發平台\nlaf 可以是開源版的騰訊雲開發、開源版的 Google Firebase、開源版的 UniCloud',
            connected: true
          },
          {
            key: 'history',
            type: 'target',
            label: '聊天記錄',
            valueType: 'chat_history',
            connected: true
          },
          {
            key: 'userChatInput',
            type: 'target',
            label: '用戶問題',
            required: true,
            valueType: 'string',
            connected: true
          },
          {
            key: 'agents',
            type: 'custom',
            label: '',
            value: [
              {
                value: '打招呼、問候等問題',
                key: 'fasw'
              },
              {
                value: '“laf” 的問題',
                key: 'fqsw'
              },
              {
                value: '商務問題',
                key: 'fesw'
              },
              {
                value: '其他問題',
                key: 'oy1c'
              }
            ],
            connected: true
          }
        ],
        outputs: [
          {
            key: 'fasw',
            label: '',
            type: 'hidden',
            targets: [
              {
                moduleId: 'a99p6z',
                key: 'switch'
              }
            ]
          },
          {
            key: 'fqsw',
            label: '',
            type: 'hidden',
            targets: [
              {
                moduleId: 'fljhzy',
                key: 'switch'
              }
            ]
          },
          {
            key: 'fesw',
            label: '',
            type: 'hidden',
            targets: [
              {
                moduleId: '5v78ap',
                key: 'switch'
              }
            ]
          },
          {
            key: 'oy1c',
            label: '',
            type: 'hidden',
            targets: [
              {
                moduleId: 'iejcou',
                key: 'switch'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'a99p6z',
        name: '指定回覆',
        flowType: 'answerNode',
        position: {
          x: 1304.2886011902247,
          y: 776.1589509539264
        },
        inputs: [
          {
            key: 'switch',
            type: 'target',
            label: '觸發器',
            valueType: 'any',
            connected: true
          },
          {
            key: 'text',
            value: '你好，我是 laf 助手，有什麽可以幫助你的？',
            type: 'textarea',
            valueType: 'string',
            label: '回覆的內容',
            description:
              '可以使用 \\n 來實現換行。也可以通過外部模塊輸入實現回覆，外部模塊輸入時會覆蓋當前填寫的內容',
            connected: true
          }
        ],
        outputs: []
      },
      {
        moduleId: 'iejcou',
        name: '指定回覆',
        flowType: 'answerNode',
        position: {
          x: 1294.2531189034548,
          y: 2127.1297123368286
        },
        inputs: [
          {
            key: 'switch',
            type: 'target',
            label: '觸發器',
            valueType: 'any',
            connected: true
          },
          {
            key: 'text',
            value: '你好，我僅能回答 laf 相關問題，請問你有什麽問題麽？',
            type: 'textarea',
            valueType: 'string',
            label: '回覆的內容',
            description:
              '可以使用 \\n 來實現換行。也可以通過外部模塊輸入實現回覆，外部模塊輸入時會覆蓋當前填寫的內容',
            connected: true
          }
        ],
        outputs: []
      },
      {
        moduleId: 'nlfwkc',
        name: 'AI 對話',
        flowType: 'chatNode',
        showStatus: true,
        position: {
          x: 1821.979893659983,
          y: 1104.6583548423682
        },
        inputs: [
          {
            key: 'model',
            type: 'custom',
            label: '對話模型',
            value: 'gpt-3.5-turbo-16k',
            list: [],
            connected: true
          },
          {
            key: 'temperature',
            type: 'slider',
            label: '溫度',
            value: 0,
            min: 0,
            max: 10,
            step: 1,
            markList: [
              {
                label: '嚴謹',
                value: 0
              },
              {
                label: '發散',
                value: 10
              }
            ],
            connected: true
          },
          {
            key: 'maxToken',
            type: 'custom',
            label: '回覆上限',
            value: 8000,
            min: 100,
            max: 4000,
            step: 50,
            markList: [
              {
                label: '100',
                value: 100
              },
              {
                label: '4000',
                value: 4000
              }
            ],
            connected: true
          },
          {
            key: 'systemPrompt',
            type: 'textarea',
            label: '系統提示詞',
            valueType: 'string',
            description:
              '模型固定的引導詞，通過調整該內容，可以引導模型聊天方向。該內容會被固定在上下文的開頭。可使用變量，例如 {{language}}',
            placeholder:
              '模型固定的引導詞，通過調整該內容，可以引導模型聊天方向。該內容會被固定在上下文的開頭。可使用變量，例如 {{language}}',
            value: '知識庫是關於 laf 的內容。',
            connected: true
          },
          {
            key: 'limitPrompt',
            type: 'textarea',
            valueType: 'string',
            label: '限定詞',
            description:
              '限定模型對話範圍，會被放置在本次提問前，擁有強引導和限定性。可使用變量，例如 {{language}}。引導例子:\n1. 知識庫是關於 Laf 的介紹，參考知識庫回答問題，與 "Laf" 無關內容，直接回覆: "我不知道"。\n2. 你僅回答關於 "xxx" 的問題，其他問題回覆: "xxxx"',
            placeholder:
              '限定模型對話範圍，會被放置在本次提問前，擁有強引導和限定性。可使用變量，例如 {{language}}。引導例子:\n1. 知識庫是關於 Laf 的介紹，參考知識庫回答問題，與 "Laf" 無關內容，直接回覆: "我不知道"。\n2. 你僅回答關於 "xxx" 的問題，其他問題回覆: "xxxx"',
            value:
              '我的問題都是關於 laf 的。根據知識庫回答我的問題，與 laf 無關問題，直接回覆：“我不清楚，我僅能回答 laf 相關的問題。”。',
            connected: true
          },
          {
            key: 'switch',
            type: 'target',
            label: '觸發器',
            valueType: 'any',
            connected: true
          },
          {
            key: 'quoteQA',
            type: 'target',
            label: '引用內容',
            valueType: 'kb_quote',
            connected: true
          },
          {
            key: 'history',
            type: 'target',
            label: '聊天記錄',
            valueType: 'chat_history',
            connected: true
          },
          {
            key: 'userChatInput',
            type: 'target',
            label: '用戶問題',
            required: true,
            valueType: 'string',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'answerText',
            label: '模型回覆',
            description: '直接響應，無需配置',
            type: 'hidden',
            targets: []
          },
          {
            key: 'finish',
            label: '回覆結束',
            description: 'AI 回覆完成後觸發',
            valueType: 'boolean',
            type: 'source',
            targets: []
          }
        ]
      },
      {
        moduleId: 's4v9su',
        name: '聊天記錄',
        flowType: 'historyNode',
        position: {
          x: 193.3803955457983,
          y: 1116.251200765746
        },
        inputs: [
          {
            key: 'maxContext',
            type: 'numberInput',
            label: '最長記錄數',
            value: 2,
            min: 0,
            max: 50,
            connected: true
          },
          {
            key: 'history',
            type: 'hidden',
            label: '聊天記錄',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'history',
            label: '聊天記錄',
            valueType: 'chat_history',
            type: 'source',
            targets: [
              {
                moduleId: 'remuj3',
                key: 'history'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'fljhzy',
        name: '知識庫搜索',
        flowType: 'kbSearchNode',
        showStatus: true,
        position: {
          x: 1305.5374262228029,
          y: 1120.0404921820218
        },
        inputs: [
          {
            type: 'custom',
            label: '關聯的知識庫',
            list: [],
            key: 'kbList',
            value: [],
            connected: true
          },
          {
            key: 'similarity',
            type: 'slider',
            label: '相似度',
            value: 0.76,
            min: 0,
            max: 1,
            step: 0.01,
            markList: [
              {
                label: '100',
                value: 100
              },
              {
                label: '1',
                value: 1
              }
            ],
            connected: true
          },
          {
            key: 'limit',
            type: 'slider',
            label: '單次搜索上限',
            description: '最多取 n 條記錄作為本次問題引用',
            value: 5,
            min: 1,
            max: 20,
            step: 1,
            markList: [
              {
                label: '1',
                value: 1
              },
              {
                label: '20',
                value: 20
              }
            ],
            connected: true
          },
          {
            key: 'switch',
            type: 'target',
            label: '觸發器',
            valueType: 'any',
            connected: true
          },
          {
            key: 'userChatInput',
            type: 'target',
            label: '用戶問題',
            required: true,
            valueType: 'string',
            connected: true
          }
        ],
        outputs: [
          {
            key: 'isEmpty',
            label: '搜索結果為空',
            type: 'source',
            valueType: 'boolean',
            targets: [
              {
                moduleId: 'tc90wz',
                key: 'switch'
              }
            ]
          },
          {
            key: 'unEmpty',
            label: '搜索結果不為空',
            type: 'source',
            valueType: 'boolean',
            targets: [
              {
                moduleId: 'nlfwkc',
                key: 'switch'
              }
            ]
          },
          {
            key: 'quoteQA',
            label: '引用內容',
            description:
              '始終返回數組，如果希望搜索結果為空時執行額外操作，需要用到上面的兩個輸入以及目標模塊的觸發器',
            type: 'source',
            valueType: 'kb_quote',
            targets: [
              {
                moduleId: 'nlfwkc',
                key: 'quoteQA'
              }
            ]
          }
        ]
      },
      {
        moduleId: 'q9equb',
        name: '用戶引導',
        flowType: 'userGuide',
        position: {
          x: 191.4857498376603,
          y: 856.6847387508401
        },
        inputs: [
          {
            key: 'welcomeText',
            type: 'input',
            label: '開場白',
            value:
              '你好，我是 laf 助手，有什麽可以幫助你的？\n[laf 是什麽？有什麽用？]\n[laf 在線體驗地址]\n[官網地址是多少]',
            connected: true
          }
        ],
        outputs: []
      },
      {
        moduleId: 'tc90wz',
        name: '指定回覆',
        flowType: 'answerNode',
        position: {
          x: 1828.4596416688908,
          y: 765.3628156185887
        },
        inputs: [
          {
            key: 'switch',
            type: 'target',
            label: '觸發器',
            valueType: 'any',
            connected: true
          },
          {
            key: 'text',
            value: '對不起，我找不到你的問題，請更加詳細的描述你的問題。',
            type: 'textarea',
            valueType: 'string',
            label: '回覆的內容',
            description:
              '可以使用 \\n 來實現換行。也可以通過外部模塊輸入實現回覆，外部模塊輸入時會覆蓋當前填寫的內容',
            connected: true
          }
        ],
        outputs: []
      },
      {
        moduleId: '5v78ap',
        name: '指定回覆',
        flowType: 'answerNode',
        position: {
          x: 1294.814522053934,
          y: 1822.7626988141562
        },
        inputs: [
          {
            key: 'switch',
            type: 'target',
            label: '觸發器',
            valueType: 'any',
            connected: true
          },
          {
            key: 'text',
            value: '這是一個商務問題',
            type: 'textarea',
            valueType: 'string',
            label: '回覆的內容',
            description:
              '可以使用 \\n 來實現換行。也可以通過外部模塊輸入實現回覆，外部模塊輸入時會覆蓋當前填寫的內容',
            connected: true
          }
        ],
        outputs: []
      }
    ]
  }
];
