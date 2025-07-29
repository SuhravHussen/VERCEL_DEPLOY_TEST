"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";
import { Currency, CurrencySymbols, CurrencyLabels } from "@/types/currency";
import { ValidationErrors } from "@/types/exam/ielts-academic/exam-creation";

interface PricingFormProps {
  examData: Partial<IELTSExamModel>;
  errors: ValidationErrors;
  onInputChange: (field: keyof IELTSExamModel, value: string | number | boolean | Currency) => void;
}

export const PricingForm: React.FC<PricingFormProps> = ({
  examData,
  errors,
  onInputChange,
}) => {
  const handleFreeToggle = (checked: boolean) => {
    onInputChange("is_free", checked);
    if (checked) {
      onInputChange("price", 0);
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_free"
            checked={examData.is_free || false}
            onCheckedChange={handleFreeToggle}
          />
          <Label htmlFor="is_free" className="text-foreground">
            Free Exam
          </Label>
        </div>

        {!examData.is_free && (
          <>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-foreground">
                Currency
              </Label>
              <Select
                value={examData.currency || Currency.USD}
                onValueChange={(value) => onInputChange("currency", value as Currency)}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Currency).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {CurrencySymbols[currency]} - {CurrencyLabels[currency]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">
                Price *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {CurrencySymbols[examData.currency || Currency.USD]}
                </span>
                <Input
                  id="price"
                  type="number"
                  value={examData.price || ""}
                  onChange={(e) => onInputChange("price", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`pl-8 bg-background border-border text-foreground ${
                    errors.price ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
