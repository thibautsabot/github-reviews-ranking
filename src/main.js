const axios = require("axios");
const Table = require("cli-table");
const emoji = require("node-emoji");

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const API_URL =
  "https://api.github." +
  (process.env.CUSTOM_DOMAIN || "com") +
  "/repos/" +
  process.env.REPO;
const PAGES = process.env.PAGES || 10;

const start = new Date();
const allIds = [];
const globalReviews = {};

const fetchIdsFromPage = async i => {
  const results = await axios(
    `${API_URL}/pulls?state=all&page=${i}&access_token=${ACCESS_TOKEN}`
  );
  results.data.map(res => {
    allIds.push(res.number);
  });
};

const fetchReviewerFormPR = async pr => {
  const results = await axios(
    `${API_URL}/pulls/${pr}/reviews?access_token=${ACCESS_TOKEN}`
  );
  results.data.map(res => {
    if (globalReviews[res.user.login]) {
      globalReviews[res.user.login] = globalReviews[res.user.login] + 1;
    } else {
      globalReviews[res.user.login] = 1;
    }
  });
};

const getAllPR = async () => {
  const allReq = [];

  try {
    for (i = 0; i != PAGES; i++) {
      allReq.push(fetchIdsFromPage(i));
    }
    await Promise.all(allReq);
    return allIds;
  } catch (e) {
    console.error(e);
  }
};

const getReviewersFromAllPR = async () => {
  const allPR = await getAllPR();

  try {
    await Promise.all(allPR.map(pr => fetchReviewerFormPR(pr)));
    return globalReviews;
  } catch (e) {
    console.error(e);
  }
};

const sortList = async () => {
  const list = await getReviewersFromAllPR();
  return Object.keys(list)
    .sort(function(a, b) {
      return list[b] - list[a];
    })
    .map(key => ({
      name: key,
      amount: list[key]
    }));
};

const getReward = index => {
  switch (index) {
    case 0:
      return emoji.get("first_place_medal");
    case 1:
      return emoji.get("second_place_medal");
    case 2:
      return emoji.get("third_place_medal");
    default:
      return "";
  }
};

const displayList = list => {
  const table = new Table({
    head: ["", "Name", "Count"],
    colWidths: [4, 50, 7]
  });

  list.forEach((entry, index) => {
    table.push([getReward(index), entry.name, entry.amount]);
  });
  console.log(table.toString());
};

sortList().then(finalList => {
  console.log(`Amount of review / pers on the last ${PAGES * 30} PRs : \n`);
  displayList(finalList);
  console.info("\n==> Execution time: %dms", new Date() - start);
});
