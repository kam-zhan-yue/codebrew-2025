FROM rust:1.86.0-slim

RUN cargo install cargo-watch
ENV PATH="/usr/local/cargo/bin:${PATH}"

WORKDIR /app
COPY Cargo.toml Cargo.lock Rocket.toml ./
COPY src ./src
RUN cargo build

EXPOSE 8000
