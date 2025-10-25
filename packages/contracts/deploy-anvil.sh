anvil & (
    sleep 1 && \
    forge script ./script/Counter.s.sol -vvvv --optimize --optimizer-runs 500 --broadcast --rpc-url=http://127.0.0.1:8545 && \
    sleep 1
) &
wait
