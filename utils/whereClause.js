//bigQ - //search=product?search=coder&page=2&category=shortsleeves&rating[gte]=4
// &price[lte]=999&price[gte]=199
// base = Product.find()
class WhereClause(){
    constructor(base, bigQ){
      this.base = base;
      this.bigQ = bigQ;
    }

    search(){
      const searchWord = this.bigQ.search ? {
        name: {
          $regex: this.bigQ.search,
          $options: 'i'
        }
      } : {

      }
      this.base = this.base.find({...searchWord})
      return this;
    }

    pager(resultperpage){
      let currentPage = 1;
      if(this.bigQ.page){
        currentPage = this.bigQ.page
      }

      const skipVal = resultperpage * (currentPage - 1)

      this.base.limit(resultperpage).skip(skipVal)
      
    }
}