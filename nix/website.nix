{ lib, stdenv, nodejs_22, nodePackages, ... }:

stdenv.mkDerivation {
  pname = "dsqr-website";
  version = "0.1.0";
  
  src = ../.;
  
  buildInputs = [
    nodejs_22
    nodePackages.pnpm
  ];
  
  buildPhase = ''
    export HOME=$(mktemp -d)
    export PNPM_HOME="$HOME/.pnpm"
    export PATH="$PNPM_HOME:$PATH"
    corepack enable && corepack prepare pnpm@9.12.3 --activate
    
    pnpm install
    pnpm add -w tailwindcss-animate
    pnpm turbo build --filter=website...
  '';
  
  installPhase = ''
    mkdir -p $out
    cp -r apps/website/dist/* $out/
  '';
  
  meta = with lib; {
    description = "DSQR Website";
    license = licenses.mit;
  };
}