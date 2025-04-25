FROM rust:1.86.0-slim

RUN cargo install cargo-watch
ENV PATH="/usr/local/cargo/bin:${PATH}"

WORKDIR /app
COPY . .
RUN cargo build

EXPOSE 8000

CMD ["cargo", "run"]