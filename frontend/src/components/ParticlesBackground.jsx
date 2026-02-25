import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: 0
        },
        background: {
          color: {
            value: "transparent"
          }
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: "#d4af37"
          },
          links: {
            enable: false
          },
          move: {
            direction: "top",
            enable: true,
            outModes: {
              default: "out"
            },
            random: true,
            speed: 0.5,
            straight: false
          },
          number: {
            density: {
              enable: true,
              area: 800
            },
            value: 60
          },
          opacity: {
            value: {
              min: 0.1,
              max: 0.5
            },
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1
            }
          },
          shape: {
            type: "circle"
          },
          size: {
            value: {
              min: 1,
              max: 4
            },
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 1
            }
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.05,
              opacity: 1,
              color: {
                value: "#f3e5ab"
              }
            }
          }
        },
        detectRetina: true
      }}
    />
  );
};
