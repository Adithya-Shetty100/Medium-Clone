import { GetStaticProps } from "next";
import Header from "../../components/header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

//define form in typescript
interface IFormInput {
  _id: string; //id defined below as hidden
  name: string; //name? means name optional
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  //   console.log(post);

  const [submitted, setSubmitted] = useState(false);
  //state of submission false by default

  //   console.log(post);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>(); //connect form with hooks

  //submit handler connects submit to form, passing submit handler as prop to onSubmit
  //comment data from form is passed into function
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    //data._id
    //console.log(data);

    //now we need to send comments to sanity database, by creating REST API which posts comments in db
    //await fetch used if no then catch below
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data), //converts js obj to JSON
    })
      .then(() => {
        //console.log(data);
        setSubmitted(true); //in ternary operator below ?: it prints submitted!!
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false); //set false if error
      });
  };

  return (
    <main>
      <Header />

      <img
        className="w-full h-80 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            src={urlFor(post.author.image).url()!}
            alt=""
            className="h-10 w-10 rounded-full"
          />

          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString("en-GB")}
          </p>
        </div>

        {/* Make info in body portable like images, list,heading,text */}
        <div className="mt-10">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc"> {children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

      {submitted ? (
        // <h1>Submitted!!</h1>
        <div className="flex flex-col py-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mx-auto">
            Thank you for submitting your comment!!
          </h3>
          <p className="mx-auto">
            Once it has been approved, it will appear below!{" "}
          </p>
        </div>
      ) : (
        //hook the onsubmit created above to form
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />

          {/* we craete id by using post id */}
          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })} //form validation
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="Enter your name"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500  focus:ring-yellow-500 outline-none focus:ring"
              placeholder="Enter your email"
              type="email"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="Add a public comment.."
              rows={8}
            />
          </label>

          {/* errors will return when field validation fails */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">-The Name field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">-The Email field is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                -The Comment field is required
              </span>
            )}
          </div>

          <input
            type="submit"
            className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline 
        focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
          />
        </form>
      )}

      {/* Comment */}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          // Each child in a list should have a unique "key" prop.
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500 font-bold">{comment.name}:</span>{" "}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;

// this gets all the paths which exists ( array of paths) and all the slugs
export const getStaticPaths = async () => {
  const query = `*[_type== "post"]{
        _id,
        slug{
        current
        }
    }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

//this takes the slug and gets each slug.current page info. Populates the page with info.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type== "post" && slug.current== $slug][0]{
        _id,
      _createdAt,
        title,
        author->{
        name,
        image,
      },
      'comments': *[
        _type=="comment" &&
        post._ref==^._id &&
        approved==true
      ],
        description,
        mainImage,
        slug,
    body
      }`;

  //This takes query to give all data in current slug, by plugging slug in $slug
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  //if no post found forced to give 404 error and returns to caller function Post
  if (!post) {
    return {
      notFound: true,
    };
  }

  //returns post to caller function Post
  return {
    props: {
      post,
    },
    revalidate: 60, //after 60seconds will update old cached version
  };
};
