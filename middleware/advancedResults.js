const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  // copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log(reqQuery);

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    // mongoose operators $greater than $less than
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // Finding resource
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  // select fields need to have a space between rather than a comma (mongoose docs)
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
    console.log(fields);
  }

  // Sort Field

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(); //mongoose Docs

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  //Execurting query
  const results = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination: pagination,
    recipe: results,
  };
  next();
};

module.exports = advancedResults;
