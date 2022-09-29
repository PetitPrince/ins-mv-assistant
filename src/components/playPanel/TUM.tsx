import { Dialog, Table } from "@mantine/core";

export const TUM = (props: { opened: boolean }) => {
  const tum1 = [
    "-",
    "-",
    "-",
    "-",
    "-",
    "0",
    "0+",
    "1",
    "1+",
    "2",
    "2+",
    "3",
    "3+",
    "4",
    "4+",
    "5",
    "5+",
    "6",
    "6+",
  ];
  const tum2 = [
    "10",
    "11",
    "12",
    "13",
    "15",
    "21",
    "23",
    "26",
    "33",
    "36",
    "43",
    "46",
    "53",
    "55",
    "61",
    "63",
    "64",
    "65",
    "66",
  ];
  const tum3 = [
    "-4.5",
    "-4",
    "-3.5",
    "-3",
    "-2.5",
    "-2",
    "-1.5",
    "-1",
    "-0.5",
    "0",
    "+0.5",
    "+1",
    "+1.5",
    "+2",
    "+2.5",
    "+3",
    "+3.5",
    "+4",
    "+4.5",
  ];

  return (
    <Dialog
      withCloseButton
      radius="md"
      opened={props.opened}
      sx={{ minWidth: 1000 }}
    >
      <Table>
        <tbody>
          <tr>
            <td>absolue</td>
            {tum1.map((x) => (
              <td key={"tum1_" + x}>{x}</td>
            ))}
          </tr>
          <tr>
            <td>LN</td>
            {tum2.map((x) => (
              <td key={"tum2_" + x}>{x}</td>
            ))}
          </tr>
          <tr>
            <td>relative</td>
            {tum3.map((x) => (
              <td key={"tum3_" + x}>{x}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </Dialog>
  );
};
