This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Learn More

how to use shadcn：

```shell
# dlx - download and execute
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button

```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## how to solve the problem of using ipfs

```shell
docker-compose exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000"]'
docker-compose exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST", "PUT"]'
docker-compose exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization", "Content-Type"]'
docker-compose exec ipfs ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000"]'
docker-compose exec ipfs ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Methods '["GET"]'

# then:
docker-compose restart ipfs

```

## why can not add data to subgraph

```shell
#TODO


```
