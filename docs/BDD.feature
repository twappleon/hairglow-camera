Feature: HairGlow legal website source recovery and alias integrity
  Background:
    Given immutable Vercel deployment dpl_FFmkHu15g9VfF3AsQeJdc4mDfGYB is read-only
    And the recovery changes are isolated in a Draft PR

  Scenario: Four privacy locales remain linked
    Given the archive contains each language's actual HTTP 200 response
    When the locale contract test executes
    Then all four pages have a title and H1
    And all four pages link to every other language variant

  Scenario: Root is faithfully recovered rather than redesigned
    Given the deployed root is English Privacy Policy
    Then snapshot/index.html must equal snapshot/privacy.html

  Scenario: READY is not sufficient to establish alias availability
    Given both HairGlow official Vercel aliases returned 404
    And the deployment-specific hostname returned 200
    Then preserve incident evidence and verify return to the original CLI deployment after corrective rollback

  Scenario: Prevent accidental publication of partial recovered source
    Given binary assets, font licenses and native app code are not recovered
    Then the archive is not considered deployable
    And no production website or app is changed

  Scenario: A source-control bootstrap must not silently replace production
    Given a previously empty repository is linked to Vercel production
    When initializing main triggers an unintended README-only deployment
    Then the live aliases must be checked immediately for 200 and expected policy content
    And any rollback must restore the verified preceding production deployment
    And future main commits remain blocked until the Git auto-deploy boundary is reviewed
