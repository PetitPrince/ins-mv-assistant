import { TalentStandard } from "../../utils/const/TalentStandard";
import { useStore } from "../../store/Store";
import { TalentRow } from "./TalentRow";
import { TalentRowMultiple } from "./TalentRowMultiple";
import { TalentRowSpecifique } from "./TalentRowSpecifique";
import { TalentDisplayRow } from "./Talents";
import { computeRowsTalents } from "./computeRowsTalents";
import { Title } from "@mantine/core";
import { Stack, Table } from "@mantine/core";
import { TalentInvesti, TalentInvestiCollection } from "../../utils/const/Personnage";

export const TalentsGenerique = (props: {
  standardTalentPool: TalentStandard[];
  title: string;
  tpool: string;
}) => {
  const standardTalentPool = props.standardTalentPool;
  const title = props.title;
  const tpool = props.tpool;
  const characterTalentsPrincipaux = useStore(
    (state) => state.currentPerso.talents.principaux
  );
  const characterTalentsSecondaire = useStore(
    (state) => state.currentPerso.talents.secondaires
  );
  const setCurrentTalentPrincipalPaDepense = useStore(
    (state) => state.setCurrentTalentPrincipalPaDepense
  );
  const setCurrentTalentSecondairePaDepense = useStore(
    (state) => state.setCurrentTalentSecondairePaDepense
  );
  const setCurrentTalentPrincipalNameFragment = useStore(
    (state) => state.setCurrentTalentPrincipalNameFragment
  );
  const setCurrentTalentSecondaireNameFragment = useStore(
    (state) => state.setCurrentTalentSecondaireNameFragment
  );
  const setCurrentTalentSecondaire = useStore(
    (state) => state.setCurrentTalentSecondaire
  );
  const setCurrentTalentPrincipal = useStore(
    (state) => state.setCurrentTalentPrincipal
  );

  let characterTalents: TalentInvestiCollection;
  let setCurrentTalentPaDense: (talentId: string, val: number) => void;
  let setCurrentTalentNameFragment: (talentId: string, val: string) => void;
  let setCurrentTalent: (talentId: string, val: TalentInvesti) => void;
  if (tpool === "Principal") {
    characterTalents = characterTalentsPrincipaux;
    setCurrentTalentPaDense = setCurrentTalentPrincipalPaDepense;
    setCurrentTalentNameFragment = setCurrentTalentPrincipalNameFragment;
    setCurrentTalent = setCurrentTalentPrincipal;
  } else {
    characterTalents = characterTalentsSecondaire;
    setCurrentTalentPaDense = setCurrentTalentSecondairePaDepense;
    setCurrentTalentNameFragment = setCurrentTalentSecondaireNameFragment;
    setCurrentTalent = setCurrentTalentSecondaire;
  }
  const currentPerso = useStore((state) => state.currentPerso);

  const rows = computeRowsTalents(
    characterTalents,
    currentPerso,
    standardTalentPool
  );

  return (
    <Stack>
      <Title order={3}>{title}</Title>
      <Table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Carac</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: TalentDisplayRow) => {
            switch (row.specialisationType) {
              case "Spécifique":
                const primaryTalentId = row.id.split("_specifique")[0];
                const isPrimary = primaryTalentId === row.id;
                if (!isPrimary) {
                  return (
                    <TalentRowSpecifique
                      row={row}
                      key={row.id}
                      talentPool={characterTalents}
                      setCurrentTalentPaDense={setCurrentTalentPaDense}
                      setCurrentTalentNameFragment={
                        setCurrentTalentNameFragment
                      }
                    />
                  );
                } else {
                  return (
                    <TalentRow
                      row={row}
                      key={row.id}
                      setCurrentTalentPaDense={setCurrentTalentPaDense}
                    />
                  );
                }
              case "Multiple":
                return (
                  <TalentRowMultiple
                    row={row}
                    key={row.id}
                    talentPool={characterTalents}
                    setCurrentTalent={setCurrentTalent}
                  />
                );
              default:
                return (
                  <TalentRow
                    row={row}
                    key={row.id}
                    setCurrentTalentPaDense={setCurrentTalentPaDense}
                  />
                );
            }
          })}
        </tbody>
      </Table>
    </Stack>
  );
};
