## Docker Setup

`docker compose up --build` from the root directory, this will spin up frontend and backend containers.

If you get errors saying modules can't be resolved, it's likely a caching problem, clear cache with:

`docker compose down --rmi all --volumes --remove-orphans`

Then `docker compose up --build`