class APIFeatures {
    constructor(query, queryStr) {

        this.query = query;
        
        this.queryStr = queryStr;
    }
    search() {
        let keyword = this.queryStr.keyword ? {

            name: {

                $regex: this.queryStr.keyword,

                $options: 'i' //removes case sensitivity
            }
        } : {};

        this.query.find({ ...keyword })

        return this;
    }

    filter() {
        const queryStrCopy = { ...this.queryStr };

        //for removing fields from query

        const removeFields = ['keyword', 'limit', 'page'];

        removeFields.forEach(field => delete queryStrCopy[field]);

        //for filtering price

        let queryStr = JSON.stringify(queryStrCopy)
       
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`);

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    //for product limit in a page

    pagination(resPerPage) {

        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resPerPage * (currentPage - 1)

        this.query.limit(resPerPage).skip(skip);

        return this;
    }

}



module.exports = APIFeatures