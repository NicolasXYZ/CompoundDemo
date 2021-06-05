#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the ganache instance that we started (if we started one and if it's still running).
  if [ -n "$ganache_pid" ] && ps -p $ganache_pid > /dev/null; then
    kill -9 $ganache_pid
  fi
}

ganache_port=8545

ganache_running() {
  nc -z localhost "$ganache_port"
}

start_ganache() {
  local accounts=(
    # 10 accounts with balance 1M ether, needed for high-value tests.
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200,100"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501201,100"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501202,100"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501203,100"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501204,100"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501205,100"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501206,100"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501207,100"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501208,100"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501209,100"
    # 3 accounts to be used for GSN matters.
    --account="0x956b91cb2344d7863ea89e6945b753ca32f6d74bb97a59e59e04903ded14ad00,100"
    --account="0x956b91cb2344d7863ea89e6945b753ca32f6d74bb97a59e59e04903ded14ad01,100"
    --account="0x956b91cb2344d7863ea89e6945b753ca32f6d74bb97a59e59e04903ded14ad02,100"
  )

set -x
  npx ganache-cli --account_keys_path "./keys" --gasLimit 0xfffffffffff --port "$ganache_port" "${accounts[@]}" > /dev/null &
  ganache_pid=$!

  #echo "Waiting for ganache to launch on port "$ganache_port"..."

  #while ! ganache_running; do
  #  sleep 0.1 # wait for 1/10 of the second before check again
  #done

  #echo "Ganache launched!"
}
#if ganache_running; then
 # echo "Using existing ganache instance"
#else
  #echo "Starting our own ganache instance"
  #start_ganache
#fi

#npx truffle version
#npx truffle test --stacktrace-extra "$@"