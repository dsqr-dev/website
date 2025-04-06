{ lib, pkgs, websiteApp, ... }:

let
  servePackage = pkgs.nodePackages.serve;
in
pkgs.dockerTools.buildImage {
  name = "dennda/dsqr-website";
  tag = "vite-latest";
  
  # This will be used for the current platform
  architecture = if pkgs.stdenv.hostPlatform.isAarch64 then "arm64" else "amd64";
  
  # Create a minimal container with just the essentials
  contents = [
    pkgs.coreutils
    pkgs.bash
    pkgs.nodejs_22
    servePackage
  ];
  
  # Copy the built website files
  copyToRoot = pkgs.buildEnv {
    name = "image-root";
    paths = [ websiteApp ];
    pathsToLink = [ "/" ];
  };
  
  # Container configuration
  config = {
    Cmd = [ "${servePackage}/bin/serve" "-s" "/" "-l" "3000" ];
    ExposedPorts = {
      "3000/tcp" = {};
    };
    WorkingDir = "/";
  };
}