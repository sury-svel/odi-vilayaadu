import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle
} from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import { getUiLanguage, tr } from "@/utils/i18n";
import { Division, ScoreCard, ScoringType } from "@/types/event";
import ScoreCardTable from "./ScoreCardTable";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";

interface Props {
  division: Division;
  editable: boolean;
  scoringType: ScoringType; 
  onSave: (card: ScoreCard) => void;
  style?: ViewStyle;
}

export default function DivisionAccordion({
  division,
  editable,
  scoringType,
  onSave,
}: Props) {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const lang = getUiLanguage(i18n);

  const title = `${tr(division.name, lang)} (${division.minAge}–${division.maxAge}) • ${division.registrationCount} ${division.registrationCount === 1 ? "kid" : "kids"}`;

  const hasPlayers = (division.registrationCount ?? 0) > 0;

  const toggleOpen = () => {
    if (hasPlayers) {
      setOpen(!open);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleOpen}
        activeOpacity={hasPlayers ? 0.7 : 1}
      >
        {/* <Text style={styles.headerText}>{title}</Text> */}
        <View style={styles.titleRow}>
          <Text style={styles.divisionName}>{tr(division.name, lang)}</Text>
          <Text style={styles.ageRange}>
            ({division.minAge}–{division.maxAge})
          </Text>
          <View style={styles.registrationBadge}>
            <Text style={styles.registrationText}>
              {division.registrationCount}{" "}
              {division.registrationCount === 1 ? "kid" : "kids"}
            </Text>
          </View>
        </View>

        {hasPlayers &&
          (open ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}
      </TouchableOpacity>

      {open && (
                <ScoreCardTable
                  cards={division.scoreCards ?? []}
                  editable={editable}
                  scoringType={scoringType}
                  onSave={onSave}
                  style={{ display: open ? "flex" : "none" }}                   
                />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  divisionName: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.text.primary,
  },
  ageRange: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  registrationBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  registrationText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
});
