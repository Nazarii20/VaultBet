import { _SERVICE, idlFactory } from "@declarations/plinko";
import { IConnector } from "@connect2ic/core";
import { useCanister } from "@connect2ic/react";

export async function usePlinkoActor(
  activeProvider: IConnector | undefined,
  crashPrincipal: string
) {
  console.log(
    "activeProvider - crashPrincipal",
    activeProvider,
    crashPrincipal
  );
  const actorResult = await activeProvider?.createActor<_SERVICE>(
    crashPrincipal,
    idlFactory,
    { host: "https://ic0.app" }
  );
  console.log("actorResult111 tsx file", actorResult);
  return actorResult!._unsafeUnwrap();
  //   const [ledgerActor] = useCanister("plinko") as unknown as [_SERVICE];
  //   return ledgerActor;
}

// export function useAnonymousCrashActor(crashPrincipal: string) {
// 	const agent = new HttpAgent({ host: 'https://ic0.app' });
// 	return Actor.createActor<_SERVICE>(idlFactory, { canisterId: crashPrincipal, agent });
// }