LC_ALL=C; dd if=/dev/urandom bs=256 count=1 2> /dev/null | tr -dc 'A-Z0-9' | head -c 8; echo
