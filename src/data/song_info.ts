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
  
  export async function songInfoEndpoint({ keyword, id }: Deps) {
    let res;
  
    if (id) {
      // Fetch song by ID
      res = await FetchClient.GET("/song/{id}", {
        params: {
          path: { id: id },
        }
      });
    } else if (keyword) {
      // Fetch song by keyword
      res = await FetchClient.GET(`/song`, {
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
  
  export function songInfoQuery(deps: Deps) {
    return createQuery(() => songProfileQueryOption(deps));
  }
  
  export function songProfileQueryOption({ keyword, id }: Deps) {
    return queryOptions({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: ["artistProfile", id ?? keyword].filter(Boolean),
      queryFn: async () => {
        let song = await songInfoEndpoint({ keyword, id });
  
        if (!song) {
          throw notFound();
        }
  
        return song;
      },
      throwOnError: true,
    });
  }
  
   export async function PostTest() {
    try {
      const response = await fetch("http://api.thcdev.sblzd.cn/song", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",  
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({
            title: 'SongTitleTest',
            languages: [1],
            localized_titles: [{
              title: 'SongLocalizedTitleTest',
              language_id: 1
            }],
            credits: [{
              artist_id: 1,
              role_id: 1
            }],
            correction_metadata: {
              description: 'SongDescriptionTest',
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
  }