export interface Post{
    _id: string;
    _createdAt: string;
    title: string;
    author:{
        name:string;
        image: string;
    };
    comments: Comment[]; 
    // [Comment] array another way of writing
    description: string;
    mainImage:{
        asset:{
            url: string;
        };
    };
    //slug has object of type of string
    slug:{
        current: string;
    };
    body:[object];
    //  array of objects

}

export interface Comment{
    approved:boolean;
    comment:string;
    email:string;
    name:string;
    post:{
        _ref:string;
        _type:string;
    };
    _createdAt:string;
    _id:string;
    _rev:string;
    _type:string;
    _updatedAt:string;
}