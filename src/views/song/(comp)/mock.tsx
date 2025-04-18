export const releaseAPIResponse = {
    status: "成功",
    data: [
      {
        id: 101,
        release_type: "专辑", // Album
        release_date: "2025-04-15", // 发行日期
        release_date_precision: "日", // 精确到“日”
        recording_date_start: "2024-09-01", // 录音开始时间
        recording_date_start_precision: "月", // 精确到“月”
        recording_date_end: "2025-02-01", // 录音结束时间
        recording_date_end_precision: "月", // 精确到“月”
        artists: [
          {
            id: 1,
            name: "莉娜·蕾（Lena Ray）", // 艺术家名称
          },
        ],
        credits: [
          {
            artist: {
              id: 1,
              name: "莉娜·蕾（Lena Ray）",
            },
            role: {
              id: 1,
              name: "主唱", // Vocalist
            },
            on: [101], // 参与的发行ID
          },
          {
            artist: {
              id: 2,
              name: "凯罗·节拍（Kairo Beats）",
            },
            role: {
              id: 2,
              name: "制作人", // Producer
            },
            on: [101],
          },
        ],
        catalog_nums: [
          {
            catalog_number: "KR2025-001", // 唱片编号
            label_id: null, // 唱片公司ID（为空）
          },
        ],
        localized_titles: [
          {
            language: {
              id: 1,
              code: "en",
              name: "英语",
            },
            title: "未来回声", // Echoes of the Future
          },
        ],
        tracks: [201, 202, 203], // 曲目ID列表
      },
    ],
  }
  