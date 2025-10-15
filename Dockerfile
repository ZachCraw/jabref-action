FROM ghcr.io/jabref/jabkit:edge

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the new entrypoint
ENTRYPOINT ["/entrypoint.sh"]