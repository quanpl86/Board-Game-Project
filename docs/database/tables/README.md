# Table-by-table Relationship Atlas (30 tables)

## identity
- [identity.users](identity.users.md)
- [identity.external_identities](identity.external_identities.md)
- [identity.profiles](identity.profiles.md)
- [identity.guardian_links](identity.guardian_links.md)
- [identity.policy_acknowledgments](identity.policy_acknowledgments.md)

## tenancy
- [tenancy.organizations](tenancy.organizations.md)
- [tenancy.organization_memberships](tenancy.organization_memberships.md)
- [tenancy.roles](tenancy.roles.md)
- [tenancy.permissions](tenancy.permissions.md)
- [tenancy.role_permissions](tenancy.role_permissions.md)
- [tenancy.role_assignments](tenancy.role_assignments.md)

## assets
- [assets.assets](assets.assets.md)
- [assets.asset_versions](assets.asset_versions.md)

## catalog
- [catalog.games](catalog.games.md)
- [catalog.game_versions](catalog.game_versions.md)

## gameplay
- [gameplay.game_rooms](gameplay.game_rooms.md)
- [gameplay.room_memberships](gameplay.room_memberships.md)
- [gameplay.matches](gameplay.matches.md)
- [gameplay.match_participants](gameplay.match_participants.md)
- [gameplay.match_commands](gameplay.match_commands.md)
- [gameplay.match_snapshots](gameplay.match_snapshots.md)
- [gameplay.match_results](gameplay.match_results.md)
- [gameplay.match_result_entries](gameplay.match_result_entries.md)

## publishing
- [publishing.content_items](publishing.content_items.md)
- [publishing.content_revisions](publishing.content_revisions.md)
- [publishing.content_publications](publishing.content_publications.md)

## integration
- [integration.domain_outbox](integration.domain_outbox.md)
- [integration.audit_events](integration.audit_events.md)
- [integration.agent_approvals](integration.agent_approvals.md)
- [integration.agent_invocations](integration.agent_invocations.md)

All per-table cards generated from the same metadata as SQL and audited by CI; each card shows direct inbound/outbound SQL FK edges and exact field declarations. 
