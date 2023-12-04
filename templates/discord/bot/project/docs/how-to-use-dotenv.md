# How to use Dotenv

You must set your bot's token and other sensitive information in the `.env` file in the project root

_However you may want to use a different env file in development._

If the `.env.development` file exists, **dotenv** will use it to load environment variables. You can use these variables in a development-only environment and when building the project, send the .env file with production variables