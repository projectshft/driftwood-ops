FROM rust:1.75 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/rate-engine /usr/local/bin/rate-engine
EXPOSE 8080
CMD ["rate-engine"]
