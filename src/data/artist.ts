import {
  createQuery,
  queryOptions,
} from "@tanstack/solid-query";
import { notFound } from "@tanstack/solid-router";
import { FetchClient } from ".";

type Deps = {
  keyword?: string | undefined;
  id?: number | undefined;
};

export async function artistProfileEndpoint({ keyword, id }: Deps) {
  let res;

  if (id) {
    // Fetch artist by ID
    res = await FetchClient.GET("/artist/{id}", {
      params: {
        path: { id: id },
      }
    });
  } else if (keyword) {
    // Fetch artist by keyword
    res = await FetchClient.GET(`/artist`, {
      params: {
        query: { keyword },
      },
    });
  } else {
    throw Error("必须提供 id 或 keyword");
  }

  if (res.data) {
    return res.data;
  } else if (res.error) {
    throw res.error.message;
  } else if (res.response.status === 404) {
    return undefined;
  } else {
    throw Error("Unknown error");
  }
}

export function artistProfileQuery(deps: Deps) {
  return createQuery(() => artistProfileQueryOption(deps));
}

export function artistProfileQueryOption({ keyword, id }: Deps) {
  return queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["artistProfile", id ?? keyword].filter(Boolean),
    queryFn: async () => {
      let artist = await artistProfileEndpoint({ keyword, id });

      if (!artist) {
        throw notFound();
      }

      return artist;
    },
    throwOnError: true,
  });
}

/* export async function postTest() {
  try {
    const response = await fetch("http://api.thcdev.sblzd.cn/artist", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",  
      },
      credentials: "include", // Include cookies in the request
      body: JSON.stringify({
        "name": "test11",
        "artist_type": "Solo",
        "text_alias": [""],
        "start_date": "2025-01-01",
        "start_date_precision": "Day",
        "end_date": "2025-12-31",
        "end_date_precision": "Day",
        "aliases": [1],
        "links": ["https://space.bilibili.com/88192390"],
        "localized_name": [
          {
            "language_id": 1,
            "name": "localized_name test"
          }
        ],
        "members": [
          {
            "artist_id": 1,
            "roles": [1],
            "join_leave": [[]]
          }
        ],
        "correction_metadata": {
          "description": "11111description test"
        }
      })
    });

    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    // 解析 JSON 数据
    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Request failed:", error);
  }
} */
