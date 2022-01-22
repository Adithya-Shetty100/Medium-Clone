// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
//import { sanityClient } from '../../sanity'; //not working, showing sanityClient not callable

//use this instead. solved by installing npm i @sanity/client locally
import sanityClient  from '@sanity/client';

//taken from sanity.js
const config={
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, //node process
    projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: process.env.NODE_ENV==="production", //production/test/dev are options
    token: process.env.SANITY_API_TOKEN,
};

const client=sanityClient(config);

//async function
export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {_id, name, email, comment}=JSON.parse(req.body);

  //instead of typing in sanity manually, data is passed to it through api
  try{
      //comment is not in sanity, so it's schema is created
      await client.create({ //when await is used, function is aync always
        _type:'comment',
        post:{
            _type: 'reference', //to reference all posts, like relational db
            _ref:_id
        },
        name,
        email,
        comment
      });
  }catch(err){
    return res.status(500).json({ message:"Couldn't submit comment", err });
  }

  //console.log("Comment submitted");
  return res.status(200).json({ message:"Comment submitted" });
  
};
