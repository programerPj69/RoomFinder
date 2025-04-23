"use client"

import { SecurityRulesTester } from "@/components/security-rules-tester"

export default function TestRulesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Firebase Security Rules Tester</h1>
      <div className="max-w-md mx-auto">
        <SecurityRulesTester />
      </div>
    </div>
  )
}
