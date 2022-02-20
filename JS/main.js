import axiosClient from "./api/axiosClient";
import postApi from "./api/postAPI";

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    };

    const data = await postApi.getALL(queryParams);
    console.log("data", data);
  } catch (error) {
    console.log("get all failed", error);
  }

  await postApi.update({
    id: "sktwi1cgkkuif36dj",
    title: "dbrr",
  });
}
main();
