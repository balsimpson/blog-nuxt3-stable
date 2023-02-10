export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let subreddit = query.subreddit
  let after = query.after
  // console.log(subreddit, after)
  
  let url = `https://www.reddit.com/r/${subreddit}/top.json`

  if (after) {
    url = `https://www.reddit.com/r/${subreddit}/top.json?after=${after}`
  }

  let res = await fetch(url)
  const results = await res.json()

  // console.log("results", results)
  return results
})