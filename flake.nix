{
  description = "🟪 DSQR Website with Nix";

  inputs = {
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-stable.url = "github:NixOS/nixpkgs/nixos-23.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs-unstable, nixpkgs-stable, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs-unstable = import nixpkgs-unstable { inherit system; };
        pkgs-stable = import nixpkgs-stable { inherit system; };
      in {
        devShells.default = pkgs-unstable.mkShell {
          buildInputs = with pkgs-unstable; [
            nodejs_22
            nodePackages.pnpm
            git
            nixpkgs-fmt
          ];

          shellHook = ''
            echo "🟪 Dev environment ready"
          '';
        };

        formatter = pkgs-unstable.nixpkgs-fmt;
      });
}
