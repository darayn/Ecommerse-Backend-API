// USer.find({qty: {$lte: 20}})
// /api/v1/product?search=coder&page=2&category=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199

// output of req.query
// {
//     search: 'coder',
//     page: '2',
//     category: 'shortsleeves',
//     rating: { gte: '4' },
//     price: { lte: '999', gte: '199' }
//   }