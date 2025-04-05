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
      in
      {
        # Development shell with all tools needed
        devShells.default = pkgs-unstable.mkShell {
          buildInputs = with pkgs-unstable; [
            nodejs_22
            nodePackages.pnpm
            turbo
            git
            nixpkgs-fmt
          ];

          shellHook = ''
            echo "🟪 development environment ready..."
          '';
        };

        # Format command for Nix files
        formatter = pkgs-unstable.nixpkgs-fmt;
      });
}
