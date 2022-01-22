export default {
    name: 'comment',
    title: 'Comment',
    type: 'document',
    fields: [
      {
        name: 'name',
        type: 'string',
      },
      {
        // comment wil appear only after author approves it 
        name: 'approved',  
        title: 'Approved',
        type: 'boolean',
        description:"Comments won't show on the site without approval",
      },
      {
        name: 'email',
        type: 'string',
      },
      {
        name: 'comment',
        type: 'text',
      },
      {
        //   reference to existing post
        name: 'post',
        type: 'reference',
        to:[{type:"post"}],
      },
    ]
  }
  